/**
 * Knack-den-Code - KdC
 * Copyright 2022/23 EW.Heinrich
 * This code is licensed under an GPL-3.0 License.
 *   Parts of the code in externally referenced modules may be subject to other licenses.
 * 
 * Vorgabe-Texte verwalten
 * 
 */

import * as KdCc from "./KdCconfig.js";

/**
 * Das Text-Inventar wird bei jedem Sprachwechsel komplett vom Server geholt.
 * Enthält das Text-Inventar eine 'test.txt' ...
 *      ... und steht da was drin ...
 *          ... dann wird nur diese angezeigt.
 * -> So ist es möglich, einen Text in test.txt vorzugeben und seine Aufbereitung
 *    zu prüfen, bevor man diesen dem Text-Inventar hinzufügt.
 */

var aTexte = [];
var tText = null;

export function loadText(actLocale, actState) {
    let icntText = 1;                                   // Zähler 'aktueller Text' initialisieren
    switch (actState) {
        case 'INIT':
            aTexte = fetchText(actLocale);                  // alle Texte zu Sprache
            break;
        default:
            icntText = KdCc.GET("icntText");
            icntText++;
            break;
    }
    let aTcnt = Object.keys(aTexte).length;             // Anzahl Texte zu Sprache
    if (icntText > aTcnt)                               // alle Texte durchlaufen -> von vorne
        icntText = 1;
    KdCc.SET("icntText", icntText);                     // Zählerstand merken
    let txtKey = "text" + icntText.toString();
    let _Text = aTexte[txtKey];                         // Text gem. Zähler holen
    if (tText)
        _Text = tText;                                      // Text aus Test-Datei nehmen
    let aText = [];
    if (_Text.indexOf("\n") > 0) {                      // Umbrüche enthalten ?
        if (_Text.indexOf("\r") > 0)                      
            _Text = _Text.replace(/\r/gm,"");               // ... Umbruch entfernen
        aText = _Text.split("\n");
    } else {
        aText.push(_Text);
    }
    return aText;                                       // Textspeicher zurückgeben
}

function fetchText(actLocale) {
    let AppHref = KdCc.GET("AppHref");
    let AppTfetch = KdCc.GET("AppTfetch");
    let AppUri = AppHref + AppTfetch + actLocale;
    console.log("fetchText", AppUri);

    const req = new XMLHttpRequest();
    let rtexte = [];

    req.open('GET', AppUri, false);
    req.send(null);
    if (req.status === 200) {
        let _text = req.responseText;
        console.log("fetchText ->", _text);
        let text = JSON.parse(_text);
        console.log("fetchText response ->", text);
        tText = null;
        Object.entries(text).forEach(entry => {
            const [key, value] = entry;
            if (key == 'test')
                tText = value;
            else 
                rtexte[key] = value;
        });
        return rtexte;
    }
}
