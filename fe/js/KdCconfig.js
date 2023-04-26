/**
 * 
 * Knack-den-Code - KdC
 * Copyright 2022/23 EW.Heinrich
 * This code is licensed under an GPL-3.0 License.
 *   Parts of the code in externally referenced modules may be subject to other licenses.
 * 
 * Steuerwerte - Zentral-Verzeichnis
 * 
 */

import * as KdCi from "./KdCimport.js";
import {expandMap} from "./AAAhelpers.js";

const confData = [
// zentrale Schalter    - 0: inaktiv    1: aktiv
    [ "doEscape", 1 ],       // Abbruch per 'Escape'
    [ "doLocales", 1],       // Sprach-Auswahl
    [ "doScramble", 1],      // Verwürfeln
    [ "doScramTime", 0],     // ScrambleTimer: > 0 Text wird nach Ablauf von ... Sekunden umgesetzt
    [ "doRestart", 1],       // Neustart gleicher Text
    [ "doUpdZa", 0],         // Bei aufgedecktem Zeichen 'Zeichen im Text' runterzählen
// Bildschirm-Layout
    [ "xH", 130],            // Startposition Header X-Achse
    [ "xL0", 160],           // Startposition Label X-Achse
    [ "xLd", 20],            // Versatz X-Achse
    [ "yH", 25],             // Startposition Header Y-Achse
    [ "yHl2", 50],           // Startposition Header 2. Zeile
    [ "yL0", 320],           // Startposition Label Y-Achse
    [ "yLd", 60],            // Versatz Y-Achse
    [ "anzZeichen", 40],     // Anzahl Zeichen in Zeile
    [ "xL", 0],              // Fenstergröße X-Achse
    [ "yL", 0],              // Fenstergröße Y-Achse
// aktive Sprache
    [ "actLocale", 'de'],
// Anzeige-Texte
    [ "icntFiles", 0],
    [ "icntText", 1],
    [ "list_files", null],
// Interaction mit Backend
    [ "AppHref", "http://hostname/AppDir/"],        // Basisadresse für fetch()
    [ "AppTfetch", "be/texte?lang="],               // Template für fetch()
];

const CONF = new Map(confData);

export function GET(key) {
    if (CONF.has(key)) {
        return CONF.get(key);
    }
    return null;
}
export function SET(key, value) {
    CONF.set(key, value);
}
export function TEST(key) {
    return CONF.has(key);
}



// Sprach-Auswahl

                    /*  key   flag  (unused)  -wid  -hei  svg-  */
export const locales = {'de': ['de', 'de_DE', 1000, 600],
                        'en': ['gb', 'en_GB', 1200, 600],
                        };

// Zeichenvorrat

const m_zeichenListe = {
    "de": "abcdefghijklmnopqrstuvwxyzäöüß",
    "en": "abcdefghijklmnopqrstuvwxyz"
};

export function loadTexte(actLocale) {
    // Text-Files zu aktuellem Sprach-Code laden
    list_files = KdCi.loadFiles(actLocale);
    let cntFiles = length(list_files);
    console.log("Anz Texte:", cntFiles, "Texte", list_files);
    icntFiles = cntFiles;
    return list_files;
}

export function main_prep_locale(locale, ASCII, cDict, cpos) {
    /* Aufbereitung Text-Informationen gem. Sprachcode */
    if (locale == "de") {
        return main_prep_de(ASCII, cDict, cpos);
    } else {
        return main_prep_en(ASCII, cDict, cpos);
    }
}

function main_prep_de(ASCII, cDict, cpos) {
    /* Aufbereitung für deutsche Texte */
    let isCap = false;
    let ASCII_ = ASCII;
    if (ASCII > 64 && ASCII < 91) {         // Großbuchstaben A - Z
        isCap = true;
        ASCII += 32;                        // umwandeln in kleine
    }
    if (ASCII > 122) {                      // Umlaute
        if (ASCII > 128 && ASCII < 160) {       // Großbuchstaben
            isCap = true;
            ASCII += 32;                        // umwandeln in kleine
        }
    }
    let cASCII = String.fromCharCode(ASCII);
    /*  cDict - Key: Index Zeichen im Gesamt-Text /*
    /*  cDkenn-Struktur
                  Zeichen als Kleinbuchstaben
                  |       dto. als ASCII-Code numerisch
                  |       |       ist Großbuchstabe
                  |       |       |       korrespondierendes Scramble-Zeichen
                  |       |       |       |   dto. als ASCII-Code numerisch */
    let cDkenn = [cASCII, ASCII_, isCap, "~", 0];
    cDict.set(cpos, cDkenn);
    return [cASCII, isCap];
}

function main_prep_en(ASCII, cDict, cpos) {
    /* Aufbereitung für englische Texte */
    let isCap = false;
    let ASCII_ = ASCII;
    if (ASCII > 64 && ASCII < 91) {         // Großbuchstaben A - Z
        isCap = true;
        ASCII += 32;                        // umwandeln in kleine
    }
    if (ASCII > 122) {                      // irrelevant
        return ['None', false];
        // if (ASCII > 128 && ASCII < 160) {       // Großbuchstaben
        //     isCap = true;
        //     ASCII += 32;                        // umwandeln in kleine
        // }
    }
    let cASCII = String.fromCharCode(ASCII);
    let cDkenn = [cASCII, ASCII_, isCap, "~", 0];   // Struktur s. vorstehend
    cDict.set(cpos, cDkenn);
    return [cASCII, isCap];
}

// Zeichenvorrat

export var zeichenliste = "";

// export function toggleLocale() {
//     /* Zwischen Sprachcodes umschalten */
//     if (actLocale == 'de') {
//         actLocale = 'en';
//         zeichenliste = m_zeichenListe.en;
//     } else {
//         actLocale = 'de';
//         zeichenliste = m_zeichenListe.de;
//     }
//     loadTexte(actLocale);
// }
export function getZeichenliste(locale) {
    /* Zeichenliste zu Sprachcode zurückgeben */
    if (locale == 'en') {
        zeichenliste = m_zeichenListe.en;
        return m_zeichenListe.en;
    } else {
        zeichenliste = m_zeichenListe.de;
        return m_zeichenListe.de;
    }
}
export function testZeichenListe(aC) {
    /* Prüfen, ob Zeichen in aktueller Zeichenliste enthalten -> Unterdrücken ungültiger Zeichen */
    function isLowerCase (input) {  
        return input === String(input).toLowerCase();
      }
    if (isLowerCase(aC))
        return (zeichenliste.includes(aC));
    // else
    ac_ = String(aC).toLowerCase();
    return (zeichenliste.includes(ac_));
}

// Zeichenliste verwürfeln

var m_GzlDict_KS = new Map();
var m_GzlDict_SK = new Map();

export function zeichenScrambler(locale) {
    function shuffle(array) {
        let shuffled = array.sort(function () {
            return Math.random() - 0.5;
        });
        return shuffled;
    }
    function makeGzlDict(gzListK, gzListV) {
        let GzLDict = new Map();                           // Umsetzungstabelle zurücksetzen
        let i = 0;
        for (const aC of gzListK) {
            GzLDict.set(aC, gzListV[i]);
            i++;
        }
        return GzLDict;
    }
    /* Zeichenliste verwürfeln, Umsetzungstabelle zurückgeben */
    let gzList = [];
    gzList = getZeichenliste(locale).split('');   // Zeichenliste in Array umwandeln
    let gzList_scram = [];
    gzList_scram = [...gzList];                   // davon Clone erstellen
    shuffle(gzList_scram);                        // Clone scrambeln
    console.log("gzList_scram", gzList_scram);
    m_GzlDict_KS = makeGzlDict(gzList, gzList_scram);   // aus Zeichenliste Klartext->Scrambled-Dictionary erstellen
    m_GzlDict_SK = makeGzlDict(gzList_scram, gzList);   // aus Zeichenliste Klartext->Scrambled-Dictionary erstellen
    console.log("_GzlDict_KS", m_GzlDict_KS);
    console.log("_GzlDict_SK", m_GzlDict_SK);
}
export function getGzdict_KS(ch) {
    /* verwürfeltes Zeichen zurückgeben */
    return m_GzlDict_KS.get(ch);
}
export function getGzdict_SK(ch) {
    /* verwürfeltes Zeichen zurückgeben */
    return m_GzlDict_SK.get(ch);
}
