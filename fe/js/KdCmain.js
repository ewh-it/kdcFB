///////////////////////////////////////////////////////////////////////////////-->
//
// Knack-den-Code - KdC
// Copyright 2022/23 EW.Heinrich
// This code is licensed under an GPL-3.0 License.
//  Parts of the code in externally referenced modules may be subject to other licenses.
//
///////////////////////////////////////////////////////////////////////////////-->

import * as KdCi from "./KdCimport.js";
import * as KdCc from "./KdCconfig.js";
import * as KdCl from "./KdClayout.js";
import { loadText } from "./KdCtexte.js";
import { switch_locale } from "./KdCtranslate.js";
import { print, expandMap } from "./AAAhelpers.js";

export function mainExec(actLocale) {
    /* Text-Dateien laden

        pro Datei 1 Durchgang

        Layout aufbereiten

        anzeigen
    */
    let AppHref = window.location.href;
    AppHref = AppHref.substring(0, AppHref.lastIndexOf('/') + 1);
    KdCc.SET("AppHref", AppHref);

    switch_locale(actLocale);
    KdCc.SET("actLocale", actLocale);

    KdCl.prepLayout();          // Basis-Layout erzeugen - Titel, Infos, Zeilen-Blöcke

    mainExec_DO('INIT');
}
export function mainExec_DO(loadTextLevel) {
    let actLocale = KdCc.GET("actLocale");
    let aText = loadText(actLocale, loadTextLevel);
    
    print(aText.length);
    aText.forEach((tpara) => {
        print(tpara.length, " : ", tpara);
    });

    let aDict = new Map();
    let cDict = new Map();
    [aDict, cDict] = main_prep(aText);
    print("aDict", aDict.size);
    aDict = new Map([...aDict].sort());
    print("cDict", cDict.size);

    // dictInfo(aDict, cDict);

    KdCl.makeLines(aText, aDict, cDict);

}
function dictInfo(aDict, cDict) {
    let i = 0;
    aDict.forEach((value, key) => {
        let _value = "([" + value[0].join() + "],[" + value[1].join() + "],[" + value[2].join() + "] ..., " + value[4] + ")";
        print( key, _value);   i++;
    });
    i = 0;
    cDict.forEach((value, key) => {
        print(i, "( " + key + ", '" + value.toString() + "')");   i++;
    });
}

function main_prep(aText) {
    /* Text analysieren
        aText ->                Vorgegebener Text

        Text wird zeichenweise durchlaufen. Relevante Zeichen sind
        alle Buchstaben. Es werden Verzeichnisse aufgebaut:

        aDict
            Verzeichnis des Zeichen-Inventars, pro Zeichen ein Eintrag,
            Gross- und Kleinschreibung gleichgesetzt

            key         Zeichen (klein)

            value-0-    aChar
                        -0-     Zähler Zeichen gesamt
                        -1-     Zähler davon Gross
            value-1-    aPos
                        Array   Positionen Zeichen im Text
            value-2-    wNames
                        Array   Text-Widgets mit gleichem Zeichen

        cDict
            Verzeichnis aller Positionen mit relevanten Zeichen, steuert
            Aufbau der Text-Felder

            key         Zeichenposition

            value       cDkenn
                        -0-     das Zeichen
                        -1-     Num-Wert Zeichen

        return  aDict   cDict
    */
    var aDict = new Map();
    var cDict = new Map();
    let cpos = 0;
    // KdCc.resetGlfdXY();
    // Gesamt-Text verarbeiten, Teiltexte ergeben sich durch Absätze
    aText.forEach((tpara) => {
        let aDict_ = new Map();
        let cDict_ = new Map();
        [aDict_, cDict_, cpos] = makeDict(tpara, cpos);
        expandMap(aDict, aDict_);
        expandMap(cDict, cDict_);
    });
    // 
    // Problem: 'ß' Teil der Zeichenliste
    //   beim Scrambling kann es passieren, dass 'ß' als gescrambeltes Zeichen
    //   einem Zeichen zugeordnet wird, welches auch als Großbuchstabe auftritt ...
    //   aber:
    //   'ß' existiert nicht als Großbuchstabe, 'ß'.upper() gibt 'SS' zurück -> sieht schlecht aus
    //   deshalb:
    //   Kontrolle, ob ein Zeichen, welches auch als Großbuchstabe erscheint, dem 'ß' zugeordnet ist
    //   wenn ja: erneutes Scrambling
    let scrambleProblem = true;
    do {
        scrambleProblem = false;                    // ... kann ja auch gutgehen
        KdCc.zeichenScrambler(KdCc.GET("actLocale"));           // Scrambling ausführen
        for (let [key, aDkenn] of aDict) {
            let aChar = aDkenn[0];                   // [Anzahl Zeichen]
            let aDhasUpper = aChar[1] > 0;              // davon groß
            if (aDhasUpper) {
                let asC = KdCc.getGzdict_KS(key);            // wie ist das umgesetzt?
                if (asC == 'ß'){
                    scrambleProblem = true;                     // als 'ß' -> nochmal
                    break;
                }
            }
        }
    } while (scrambleProblem);

    // Gescrambelte Zeichen ergänzen
    aDict.forEach((aDkenn, key) => {
        let key_KS = KdCc.getGzdict_KS(key);
        let key_KSn = (key_KS == "~") ? 0 : key_KS.charCodeAt(0);
        aDkenn[4] = key_KS;
        aDkenn[5] = key_KSn;
    });
    // Gescrambelte Zeichen ergänzen
    cDict.forEach((cDkenn, key) => {
        let aC = cDkenn[0];
        let aDkenn = aDict.get(aC);
        cDkenn[3] = aDkenn[4];
        cDkenn[4] = aDkenn[5];
    });
    return [aDict, cDict];
 }

function makeDict(aText, cPos) {
    /* Verzeichnisse aufbauen

        aText ->            Teiltext
        cPos  ->            Zähler Zeichenpositionen über Gesamt-Text

        return

            aDict           Zeicheninventar
                            Verzeichnis der Positionen im Text

            cDict           Verzeichnis relevante Positionen
                            steuert Aufbau Text-Widgets

            cpos            fortgeschriebener Zähler Zeichen gesamt
    */
    let aDict = new Map();
    let cDict = new Map();
    let actLocale = KdCc.GET("actLocale");
    // Text zeichenweise durchlaufen
    const aText_ = aText.split("");
    aText_.forEach( c => {
        let ASCII = c.charCodeAt(0);
        let cASCII = " ";
        let aKenn = [];
        let isCap = false;
        // nur Buchstaben, keine Leer- und Satzzeichen
        if (ASCII > 64) {
            [cASCII, isCap] = KdCc.main_prep_locale(actLocale, ASCII, cDict, cPos);
            if (cASCII !== 'None') {
                if (aDict.has(cASCII)) {
                    aKenn = aDict.get(cASCII);
                    let aChar = aKenn[0];
                    let aPos = aKenn[1];
                    let lList = aKenn[2];
                    let uList = aKenn[3];
                    if (isCap) {
                        aChar[1] += 1;
                    }
                    aChar[0] += 1;
                    aPos.push(cPos);
                    aKenn = [aChar, aPos, lList, uList];
                    aDict.set(cASCII, aKenn);
                } else {
                    /* aDict    Key: cASCII (Zeichen verwendet - Kleinbuchstabe)    */
                    /* aKenn - Struktur
                                aChar [Anzahl Zeichen, davon Großbuchstaben]
                                |      aPos [Liste Positionen im Text-gesamt]
                                |      |     lList [Liste Elemente Kleinbuchstaben]
                                |      |     |      uList [Liste Elemente Großbuchstaben]
                       aKenn = [aChar, aPos, lList, uList];
                    */
                    let aChar = [1, 0];
                    let aPos = [cPos];
                    let lList = []; let uList = [];
                    let cASCIIs = "~";
                    aKenn = [aChar, aPos, lList, uList];
                    if (isCap) {
                        aChar[1] += 1;
                    }
                    aDict.set(cASCII, aKenn);
                }
                print(c + ":" + cPos.toString() + " - " + ASCII.toString() + " - " + cASCII +
                " aKenn ([" + aKenn[0] + "], [" + aKenn[1] + "], [" + aKenn[2] +"])");
          }
        }
        cPos += 1;
    });
    if (aDict.has('cASCII')) {
        aDict.delete('cASCII');
    }
    return [aDict, cDict, cPos];
}