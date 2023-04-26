/**
 * 
 * Knack-den-Code - KdC
 * Copyright 2022/23 EW.Heinrich
 * This code is licensed under an GPL-3.0 License.
 *   Parts of the code in externally referenced modules may be subject to other licenses.
 * 
 * Bildschirm-Elemente - Beschriftungen
 * 
 */

import { print } from "./AAAhelpers.js";

/**
 * Die Button-Texte - 'btnNT'/'btnDA' - sollen zweizeilig ausgefüllt werden, die 
 * Beschriftungen enthalten aber unterschiedliche Zahlen an Elementen ...
 * ... deshalb wird die Trennposition im Text mit '|' vorgegeben
 */

const KdCtext_de = `{"values":{
    "title": "Knack-den-Code!",
    "lblFv": "Fehlversuche",
    "lblZa": "Zeichen im Text",
    "lblZr": "- davon erkannt",
    "lblZc": "noch verdeckt",
    "btnNT": "Neuer|Text",
    "btnDA": "Noch|Mal",
    "fSuccess": "Geschafft!",
    "ZZZL": "de"
}}`;

const KdCtext_en = `{"values":{
    "title": "Brake-the-Code!",
    "lblFv": "Failed attempts",
    "lblZa": "Signs in text",
    "lblZr": "- already uncovered",
    "lblZc": "still covered",
    "btnNT": "New|text",
    "btnDA": "Do it|Again",
    "fSuccess": "Success!",
    "ZZZL": "en"
}}`;


function load_KdCtext(_locale) {
    let _text = '';
    switch(_locale) {
        case 'en':
            _text = KdCtext_en;
            break;
        default:
            _text = KdCtext_de;
    }
    // Prepare - remove newlines and double whitespaces to get proper JSON-ready text
    _text = _text.replace(/[\r]/g, '');
    _text = _text.replace(/ {2,}/g, ' ');
    let data = JSON.parse(_text);
    return data;
}

export function switch_locale(_locale) {
    // Clear previous state
    i18n.translator.reset();

    // Set the data
    let TXTdata = load_KdCtext(_locale);
    i18n.translator.add(TXTdata);

    print("switch_locale", _locale);
}

switch_locale('de');
