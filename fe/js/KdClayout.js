/**
 * Knack-den-Code - KdC
 * Copyright 2022/23 EW.Heinrich
 * This code is licensed under an GPL-3.0 License.
 *   Parts of the code in externally referenced modules may be subject to other licenses.
 * 
 * Bildschirm-Elemente erzeugen
 * 
 */

import * as KdCc from "./KdCconfig.js";
import { print, expandMap, expandArray, strNN } from "./AAAhelpers.js";
import { loadText } from "./KdCtexte.js";
import { mainExec, mainExec_DO } from "./KdCmain.js";

const infoValues = {
    "cntFv" : { "id": "cntFv", "label": "", "value": 0},
    "cntZa" : { "id": "cntZa", "label": "", "value": 0},
    "cntZc" : { "id": "cntZc", "label": "", "value": 0},
    "cntZr" : { "id": "cntZr", "label": "", "value": 0}
};

const m_linDict = new Map();                // Verzeichnis Felder in Zeilen-Blöcken
var m_linAr = [];                           // Verzeichnis Felder gesamt
const m_cDict = new Map();                  // Verzeichnis aller Text-Positionen
const m_aDict = new Map();                  // Verzeichnis der verwendeten Zeichen -> "Test" ergibt 3 Einträge 'e','s','t'
var m_aText = [];                           // Verzeichnis der Text-Blöcke -> 2 Absätze im Text ergeben 2 Einträge
var m_iPos = 0;                             // Navigationshilfe -> aktuelle Position bei ArrowDown/ArrowUp

export function prepLayout() {
    /* Basis-Layout erzeugen - Titel, Infos, Zeilen-Blöcke */
    // Titel
    let cbgt = document.getElementById("bg-title");
    let dElem = cbgt.firstChild;
    dElem.textContent = i18n("title");
    // Info-Boxen
    let cbgi = document.getElementById("bg-ibox1");
    prepLayoutInfoV(cbgi, "Za", "l1");
    prepLayoutInfoV(cbgi, "Zr", "l2");
    cbgi = document.getElementById("bg-ibox2");
    prepLayoutInfoV(cbgi, "Fv","l1");
    prepLayoutInfoV(cbgi, "Zc", "l2");

    let dLcnt = document.getElementsByClassName("dLine");
    for (let i = 1; i <= dLcnt; i++) {
        let dLine = document.getElementById("Line" + String(i));
        dLine.classList = "dLine hid-line";
    }

    // Message-Box 'Erfolg'
    let mbox = document.getElementById("msgdone");
    let mboxp = mbox.getElementsByTagName("p");
    mboxp[0].textContent = i18n("fSuccess");
    toggle_MsgBox(false);

    prepBtns("btnNT");
    prepBtns("btnDA");

    prepFlagBox();
}

function prepFlagBox() {
    let actLocale = KdCc.GET("actLocale");
    let Clocales = KdCc.locales;
    let efbox = document.getElementById("bg-flags");
    efbox.innerHTML = "";

    let alocales = Clocales[actLocale];
    prepFlags(efbox, actLocale, alocales[0], false);
    for(const [key, locales] of Object.entries(Clocales)) {
        let _locale = locales[0];
        if (key != actLocale) {
            prepFlags(efbox, key, _locale , true);
        }
    }

    efbox.addEventListener('click', TestFlag);

}
function prepFlags(pelem, locale, flagKey, doClick) {
    let delem = document.createElement("div");
    if (doClick) {
        delem.classList = "flag-s";
    } else {
        delem.classList = "flag-b";
    }
    
    let belem = document.createElement("button");
    belem.type = "button";
    belem.name = locale;
    belem.title = locale;
    belem.classList = flagKey;

    delem.appendChild(belem);
    // if (doClick) {
    //     // belem.classList = "flag-s " + flagKey;
    // } else {
    //     // belem.classList = "flag-b " + flagKey;
    // }
    pelem.appendChild(delem);
}

function prepBtns(_cbtn) {
    let _ckey = "." + _cbtn;
    let btnNTs = document.querySelectorAll(_ckey);
    let btext = i18n(_cbtn).split("|");
    btnNTs.forEach(bElem => {
        bElem.removeEventListener('click', TestClick);
        bElem.innerHTML = "";
        btext.forEach(line => {
            let pline = document.createElement("p");
            pline.textContent = line;
            bElem.appendChild(pline);
        });
        bElem.addEventListener('click', TestClick);
    });
}
function toggle_MsgBox(doShow) {
    let dElem = document.getElementById("msg-box");
    if (doShow)
        dElem.style.visibility = "visible";
    else
        dElem.style.visibility = "hidden";
}
function prepLayoutInfoV(bElem, eKey, ln) {
    let iKey = "cnt" + eKey;                            // ID definieren
    let iVal = infoValues[iKey];                        // Verzeichnis-Eintrag holen

    let cKenn = ".bg-infoV" + ln;
    let pElem = bElem.querySelector(cKenn);             // korrespondierendes DOM-Element

    let dElemL = pElem.querySelector("label");              // ... darin Beschriftung
    let lKey = "lbl" + eKey;
    let lKey_text = i18n(lKey);                                 // ... die Übersetzung
    dElemL.textContent = lKey_text;                             // ... Text zuweisen
    dElemL.classList = "nope";                                  // ... für Interaktion sperren
    let dElemI = pElem.querySelector("input");              // ... darin Wert-Feld
    dElemI.value = 0;                                           // ... initialisieren
    dElemI.classList = "nope";                                  // ... für Interaktion sperren

    infoValues[iKey] = iVal;                 // Verzeichnis-Eintrag aktualisieren
}

function updValInfoV(eKey, uval) {
    let iKey = "cnt" + eKey;                    // ID definieren
    let dElemI = document.getElementById(iKey);
    dElemI.value = uval;
    setInfoValue(iKey, uval);
}
function setInfoValue(iKey, uval) {
    infoValues[iKey].value = uval;
    // print(iKey, infoValues[iKey]);
}
function getInfoValue(iKey) {
    return infoValues[iKey].value;
}
function addValInfoV(eKey, uval, showVal=true) {
    let iKey = "cnt" + eKey;                    // ID definieren
    let ival = getInfoValue(iKey);
    ival += uval;
    setInfoValue(iKey, ival);
    if (showVal) {
        let dElemI = document.getElementById(iKey);
        dElemI.value = ival;
    }
}
function getValInfoV(eKey) {
    let iKey = "cnt" + eKey;                    // ID definieren
    let ival = getInfoValue(iKey);
    return ival;
}

export function makeLines(aText, aDict, cDict) {
    /* Layout erzeugen

        aText ->            Vorgegebener Text

        aDict ->            Dictionary verwendete Zeichen - Key: Zeichen (Kleinbuchstabe)

        cDict ->            Dictionary alle relevante Zeichen im Text - Key: (num) Position im Satz

        Pro Zeile 40 Zeichen. Umbrüche im Text ergeben neue Zeile.

        return: root
    */
    m_cDict.clear();
    expandMap(m_cDict, cDict);
    /* aDict    Key: cASCII (Zeichen verwendet - Kleinbuchstabe)    */
    /* aDkenn - Struktur
                aChar [Anzahl Zeichen, davon Großbuchstaben]
                |      aPos [Liste Positionen im Text-gesamt]
                |      |     lList [Liste Elemente Kleinbuchstaben]
                |      |     |      uList [Liste Elemente Großbuchstaben]
       aDkenn = [aChar, aPos, lList, uList];
    */
    m_aDict.clear();
    expandMap(m_aDict, aDict);

    m_aText.length = 0;
    m_aText = expandArray(aText);

    m_linAr.length = 0;

    makeLines_DO(aText, aDict, cDict);

    const bElem = document.getElementsByTagName("body")[0];
    if (!bElem.hasAttribute('listeners')) {
        bElem.addEventListener('keydown', (event) => { TestKey_Body(event); });
        let Elisteners = '_nix_, keydown';
        bElem.setAttribute('listeners', Elisteners);
    }

}

function makeLines_DO(aText, aDict, cDict) {
    let actLocale = KdCc.GET("actLocale");
    for(const [key, oval] of Object.entries(infoValues)) {
        oval.value = 0;
    }
    updValInfoV("Za", aDict.size);
    updValInfoV("Zr", 0);
    updValInfoV("Fv", 0);
    updValInfoV("Zc", cDict.size);

    /**
     * pro Text-Abschnitt von 40 Zeichen wird jeweils diese Struktur aufgebaut:
    *   <div id="Line1" class="dLine">
    *       <div class="dLine1">
    *           <input id="text-n-nn" ...           aktive Zeichen - wenn aufgedeckt: readonly
    *           ...</div>
    *       <div class="dLine2">
    *           <input id="show-n-nn" ...           scrambled Zeichen disabled
    *           ...</div>
    *       <div class="dLine3">
    *           <span> ...                          Wort-Grenzen-Markierungen
    *           ...</div>
    *   </div>
    */
    let DOMlines = document.querySelectorAll(".dLine");
    DOMlines.forEach((dline) => {
        let dlClist = String(dline.classList);              // alle '.dLine'-Elemente
        if (!dlClist.includes("hid-line"))                  // ... nicht ausgeblendet?
            dline.classList.toggle("hid-line");                 // ausblenden!
        for (let dlinex of dline.children) {                // dazu .dline1 / .dline2 prüfen
            if (dlinex.hasChildNodes()) {                         // bereits Einträge vorhanden?
                let lcontent = dlinex.childNodes;
                if (lcontent.length > 0) {
                    while (dlinex.firstChild)
                        dlinex.removeChild(dlinex.firstChild);
                }
            }
        }
    });
    let iT = 0;
    let iL = 1;
    m_linDict.clear();
    m_linAr.length = 0;
    aText.forEach((tpara) => {
        [iL, iT] = makeDlines(tpara, iL, iT);
        iL++;
    });
    const bElem = document.getElementById("bg-lines");
    if (!bElem.hasAttribute('listeners')) {
        bElem.addEventListener('keydown', (event) => { TestKey(event); });
        let Elisteners = '_nix_, keydown';
        bElem.setAttribute('listeners', Elisteners);
    } else {
        let Elisteners = bElem.getAttribute('listeners');
        if (Elisteners.indexOf('keydown') == 0) {
            Elisteners +=(', keydown');
            bElem.setAttribute('listeners', Elisteners);
        }
    }
    let nextPos = "text-1-01";
    let nElem = document.getElementById(nextPos);
    nElem.focus();
}
function reportFocus() {
    let fElem = document.activeElement;
    print(fElem, fElem.classList, fElem.name, "focus=" , true);
}
function makeDlines(tpara, iL, iT) {
    function getdl(iL) {
        /* nächste Zeile anlegen */
        let dlAct = "Line" + iL.toString();
        let dline = document.getElementById(dlAct);
        dline.classList.toggle("hid-line");
        let dl1 = dline.querySelector(".dLine1");
        let dl2 = dline.querySelector(".dLine2");
        let dl3 = dline.querySelector(".dLine3");
        dl1.innerHTML = "";
        dl2.innerHtML = "";
        dl3.innerHtML = "";
        return [dline, dl1, dl2, dl3];
    }
    function getnz(iC) {
        /* aktuelles Zeichen und nächstes Zeichen holen */
        let aC = tpara_[iC];
        let aCn = null;
        if (iC+1 < tpara_.length)
            aCn = tpara_[iC+1];
        return [aC, aCn];
    }
    let anzZeichen = KdCc.GET("anzZeichen");
    let tpl = tpara.length;
    let tpc = parseInt(tpl / anzZeichen) + 1;

    let dlAct = "Line" + iL.toString();
    let dline = document.getElementById(dlAct);
    dline.classList.toggle("hid-line");

    let dl1 = dline.querySelector(".dLine1");
    let dl2 = dline.querySelector(".dLine2");
    let dl3 = dline.querySelector(".dLine3");
    dl1.innerHTML = "";
    dl2.innerHtML = "";
    dl3.innerHtML = "";
    const tpara_ = tpara.split("");
    let iCall = 0;                              // Zähler Zeichen in Zeile gesamt
    let iCaz = 0;                               // Zähler aktive Zeichen in Zeile
    let aLfields = [];
    let Wanf = true;                            // Wort fängt an
    let sC3 = "&lang;";                         // Zeiger Wort-Anfang / -Ende
    let aCb = "";                               // jeweils vorheriges Zeichen
    for (let iC = 0; iC<tpara_.length; iC++) {      // Zeilen-Verzeichnis bis Anfang durchlaufen
        let [aC, aCn] = getnz(iC);
        iCall++;
        if (iCall > anzZeichen) {
            let dlInfo = [iCall-1, iCaz, aLfields];
            aLfields = [];
            m_linDict.set(iL, dlInfo);          // Anzahl Zeichen [gesamt, aktiv] in Zeile merken
            iCall = 1; iL++;
            [dline, dl1, dl2, dl3] = getdl(iL);
            iCaz = 0;
        }
        /* Leerzeichen am Anfang einer Zeile sind nicht schön ...
            Ist das erste Zeichen des Blocks ein Leerzeichen:
            - Zähler Text gesamt hochzählen
            - Zähler Absatz-Zeichen asynchron hochzähler
        */
        if (aC == " " && iCall == 1) {
            iT++; iC++;
            [aC, aCn] = getnz(iC);
            Wanf = m_cDict.has(iT);
        }

        let tfx = "text-" + iL.toString() + "-" + strNN(iCall);

        let _aC = aC;
        let isCap = false;
        let etf1 = document.createElement("input");
        if (m_cDict.has(iT)) {                  // ist gültiges Zeichen
            let _cD = m_cDict.get(iT);
            _aC = KdCc.getGzdict_KS(_cD[0]);
            isCap = _cD[2];
            if (isCap)                                         // ist Großbuchstabe
                _aC = String(_aC).toUpperCase();
            etf1.setAttribute("id", tfx);
            etf1.setAttribute("iT", iT.toString());
            etf1.type = "text";
            etf1.placeholder = "_";
            etf1.classList = "iFeld";
            etf1.value = "";
            aLfields.push(tfx);
            upd_aDict(aC, isCap, tfx);                         // Feld in Zeichen-Verzeichnis merken
            iCaz++;
            /* dLine3 - Wortgrenzen erkennbar machen ...
                Wanf    Wort beginnt
                aCn     als nächstes kommendes Zeichen ...
                        - nicht definiert ... wenn aktuelles Zeichen letztes im Absatz war
                            -> keine Markierung
                        - ist definiert:
                            aCn kein relevantes Zeichen -> dann aktuelles Zeichen Wortende
                            aCn ist relevantes Zeichen -> dann aktuelles Zeichen nicht Wortende
            */
            if (Wanf)
                sC3 = (m_cDict.has(iT+1)) ? "&lang;" : "&hArr;";
            else {
                if (aCn) {
                    sC3 = (m_cDict.has(iT+1)) ? "&minus;" : "&rang;";
                } else
                    sC3 = "&nbsp;";
                    if (iC+1 >= tpara_.length)
                        sC3 = "&rang;";
                }
            Wanf = false;
        } else {
            let dfx = tfx.replace("text","blank");
            etf1.setAttribute("id", dfx);
            etf1.type = "text";
            etf1.classList = "iFeld hid-line";
            sC3 = "&nbsp;";
            Wanf = true;
        }
        dl1.appendChild(etf1);

        tfx = tfx.replace("text","show");

        makelDline2(dl2, tfx, _aC);

        let etf3 = document.createElement("span");
        etf3.innerHTML = sC3;
        dl3.appendChild(etf3);

        iT++;
        /* Punkte und andere Satzzeichen am Anfang einer Zeile sind nicht schön ...
           Ist ein Zeilenblock komplett gefüllt - das nächste Zeichen würde einen
           Block-Wechsel auslösen . wird das Folge-Zeichen geprüft: 
            Ist es ein Satzzeichen?
                - als zusätzliches Zeichen an den aktuellen Block hängen
                - Zeichenzähler asynchron hochzählen
        */
        if (iCall == anzZeichen) {                      // letztes Zeichen im Block
            if (!m_cDict.has(iT)) {                         // kein Eintrag im Zeichen-Verzeichnis
                if (aCn) {                                      // ist aber noch Teil des Textes
                    if (aCn > " ") {                                // kein Leerzeichen
                        iCall++;                                        // Zähler Block-Anzahl hochsetzen
                        tfx = "show-" + iL.toString() + "-" + strNN(iCall);    // Kennung bilden
                        makelDline2(dl2, tfx, aCn);                     // Anzeige-Zeichen erzeugen
                        iT++;                                           // Zähler Text-Gesamt hochsetzen
                        iC++;                                           // Zeichen Zeichen-in-Absatz hochsetzen
                    }
                }
            }
        }
    }
    let dlInfo = [iCall, iCaz, aLfields];
    m_linDict.set(iL, dlInfo);          // Anzahl Zeichen [gesamt, aktiv] in Zeile merken

    return [iL, iT];
}
function makelDline2(dl2, tfx, _aC) {
    let etf2 = document.createElement("input");
    etf2.setAttribute("id", tfx);
    etf2.type = "text";
    etf2.placeholder = "_";
    etf2.classList = "sFeld";
    etf2.disabled = true;
    etf2.value = _aC;
    dl2.appendChild(etf2);
}
function upd_aDict(aC, isCap, tfx) {
    if (isCap) 
        aC = aC.toLowerCase();
    let aDkenn = m_aDict.get(aC);
    /*          [aChar, aPos, lList, uList] */
    let lList = aDkenn[2];
    let uList = aDkenn[3];
    if (isCap)
        uList.push(tfx);
    else
        lList.push(tfx);
    aDkenn[2] = lList;
    aDkenn[3] = uList;
    m_aDict.set(aC, aDkenn);

    m_linAr.push(tfx);

}
function actionDone() {
    toggle_MsgBox(true);
    let fElem = document.getElementById("msg-box");
    let aElem = fElem.querySelector("button");
    aElem.focus();

}

// Key-Aktionen

function TestKey_Body(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.key, event.code, event.target.id);
    let _code = event.code;
    switch (_code) {
    // 'Pos1' und 'End' erlauben - incl. Extremwerte
        case "Home":
        case "End":
            _code = (event.ctrlKey) ? "Max" + event.key : event.key;
            _code = "Arrow" + _code;
            break;
        default:
            _code = "ArrowMaxHome";
    }
    switch (_code) {
        case "ArrowMaxHome":
            shiftMax(0);
            break;
        case "ArrowMaxEnd":
            shiftMax(999);
            break;

    }
}

function TestKey(event) {
    event.preventDefault();
    event.stopPropagation();
    let tval = event.target.value;
    let iD = event.target.id;
    if (!iD.startsWith("text-")) {
        if (event.target.hasAttribute("oldval")) {
            let oVal = event.target.getAttribute("oldval");
            event.target.value = oVal;
            return;
        }
    }
    console.log(event.key, event.code, event.target.id, tval);
    let _code = event.code;
    switch (_code) {
    // Umlaute werden nicht als 'Key...'-Code gemeldet -> spezielle Umsetzung!
        case "Quote":
            _code = "Key" + event.key;          // 'ä'
            break;
        case "BracketLeft":
            _code = "Key" + event.key;          // 'ü'
            break;
        case "Semicolon":
            _code = "Key" + event.key;          // 'ö'
            break;
        case "Minus":
            _code = "Key" + event.key;          // 'ß'
            break;
    // 'Pos1' und 'End' erlauben - incl. Extremwerte
        case "Home":
        case "End":
            _code = (event.ctrlKey) ? "Max" + event.key : event.key;
            _code = "Arrow" + _code;
            break;
       }
    if (_code.startsWith("Key")) {
        m_iPos = 0;
        let oEid = event.target.id;
        let nval = TestVal(event, tval);
        event.target.value = nval;
        let ctcnt = getValInfoV("Zc");                 // Zähler 'noch verdeckt'
        if (ctcnt < 1) {
            actionDone();
            return;
        }
        if (nval !== tval) {
            _code = "ArrowRight";
            let ef = ShiftFocus(oEid, _code);
            if (ef)
                return;
            _code = "ArrowDown";
            ShiftFocus(oEid, _code);
        }
    } else 
        TestKey_Arrows(event, tval, _code);
}
function TestKey_Arrows(event, tval, _code) {
    if (_code.startsWith("Arrow")) {
        ShiftFocus(event.target.id, _code);
    } else if (_code == "Tab") {
        if (event.shiftKey)
            _code = "ArrowLeft";
        else
            _code = "ArrowRight";
        ShiftFocus(event.target.id, _code);
     } else if (_code == "Backspace") {
        tval = "";
    }
    event.target.value = tval;
}
function aktInd(_iD) {
    return (element) => element == _iD;
}
function ShiftFocus(_iD, _code) {
    let iDa = _iD.split("-");
    let iLine = parseInt(iDa[1]);
    let iPos = parseInt(iDa[2]);
    let dlInfo = m_linDict.get(iLine);
    let aLinfo = dlInfo[2];
    let fLi = aLinfo.findIndex(aktInd(_iD));
    let aLilen = aLinfo.length - 1;
    let ef = false;
    switch(_code) {
        case "ArrowRight":
            if (fLi >= 0) {
                if (fLi < aLilen) {
                    ef = shiftRight(fLi, aLinfo);
                    if (ef)
                        return ef;
                    ef = shiftDown(iLine, iPos);
                } else {
                    ef = shiftDown(iLine, 1);
                }
            } else {
                iPos += 1;
                ef = shift_DO(iLine.toString(), iPos, aLinfo);
                if (!ef) 
                    ef = shiftDown(iLine, 1);
            }
            break;
        case "ArrowLeft":
            if (fLi > 0) {
                ef = shiftLeft(fLi, aLinfo);
                if (ef)
                    return ef;
                ef = shiftUp(iLine, iPos);
            } else {
                ef = shiftUp(iLine, 99);
            }
            break;
        case "ArrowUp":
            ef = shiftUp(iLine, iPos);
            break;
        case "ArrowDown":
            ef = shiftDown(iLine, iPos);
            break;
        case "ArrowHome":
            ef = shiftLeft(1, aLinfo);
            break;
        case "ArrowMaxHome":
            ef = shiftMax(0);
            break;
        case "ArrowEnd":
            aLilen--;
            ef = shiftRight(aLilen, aLinfo);
            break;
        case "ArrowMaxEnd":
            ef = shiftMax(999);
            break;
    }
    return ef;
}
function shiftMax(fLi) {
    m_iPos = 0;
    let nextPos = "-";
    if (fLi == 0)
        nextPos = m_linAr[0];
    else {
        let alen = m_linAr.length - 1;
        nextPos = m_linAr[alen];
    }
    let nElem = document.getElementById(nextPos);
    if (nElem) {
        nElem.focus();
        return true;
    }
    return false;
}
function shiftRight(fLi, aLinfo) {
    m_iPos = 0;
    let nLi = fLi + 1;
    let nextPos = aLinfo[nLi];
    let nElem = document.getElementById(nextPos);
    if (nElem) {
        nElem.focus();
        return true;
    }
    return false;
}
function shiftLeft(fLi, aLinfo) {
    m_iPos = 0;
    let nLi = fLi - 1;
    let nextPos = aLinfo[nLi];
    let nElem = document.getElementById(nextPos);
    if (nElem) {
        nElem.focus();
        return true;
    }
    return false;
}
function shiftUp(iLine, iPos) {
    if (m_iPos == 0)
        m_iPos = iPos;
    let lDcnt = m_linDict.size;                                 // Anzahl Elemente Lines-Dict
    if (iLine == 1)                                             // Aktuelle Zeile ist 1. Zeile
        iLine = lDcnt + 1;                                          // ... auf Ende Zeilen-Verzeichnis setzen
    if (iLine > 0) {
        for (let nLine = iLine - 1; nLine > 0; nLine--) {           // Zeilen-Verzeichnis bis Anfang durchlaufen
            let dlInfo = m_linDict.get(nLine);                          // Zeilen-Info holen
            let aLinfo = dlInfo[2];                                         // Verzeichnis aktive Felder in Zeile
            let ef = shift_DO(nLine.toString(), iPos, aLinfo);
            if (ef)
                break;
        }
    }
}
function TestiPos(nLine_, iPos, aLinfo) {
    function testiPdo(nLine_, iP, aLinfo) {
        let nextPos = "text-" + nLine_ + "-" + strNN(iP);       // Feldnamen analog vorheriges Zeilen-Feld
        let fLi = aLinfo.findIndex(aktInd(nextPos));                    // ... vorhanden?
        print("TestiPos", m_iPos, nextPos, fLi, "->", aLinfo);
        return fLi;
    }
    let fLi = testiPdo(nLine_, m_iPos, aLinfo);
    if (fLi >= 0)
        return fLi;
    if (m_iPos < iPos) {
        for (let _iPos=m_iPos+1; _iPos<=iPos; _iPos++) {
            fLi = testiPdo(nLine_, _iPos, aLinfo);
            if (fLi >= 0)
                return fLi;
        }
    }
    if (m_iPos > iPos) {
        for (let _iPos=iPos; _iPos<m_iPos; _iPos++) {
            fLi = testiPdo(nLine_, _iPos, aLinfo);
            if (fLi >= 0)
                return fLi;
        }
    }
    return -1;
}
function shift_DO(nLine_, iPos, aLinfo) {
    let fLi = -1;
    let nextPos = "text-" + nLine_ + "-" + strNN(iPos);         // Feldnamen analog vorheriges Zeilen-Feld
    if (m_iPos > 0) {
        fLi = TestiPos(nLine_, iPos, aLinfo);
    }
    if (fLi < 0) {
        nextPos = "text-" + nLine_ + "-" + strNN(iPos);         // Feldnamen analog vorheriges Zeilen-Feld
        fLi = aLinfo.findIndex(aktInd(nextPos));                    // ... vorhanden?
    }
    if (fLi >= 0) {                                                     // Ja ...
        let nextPos = aLinfo[fLi];
        let nElem = document.getElementById(nextPos);                   // Feld im DOM?
        if (nElem) {
            nElem.focus();                                              // Ja -> positionieren
            return true;
        }
    }
    let ef = true;
    aLinfo.forEach( _iD => {
        if (ef) {
            let iDa = _iD.split("-");
            let iP = parseInt(iDa[2]);
            if (iP > iPos) {
                let nElem = document.getElementById(_iD);
                if (nElem) {
                    nElem.focus();
                    ef = false;
                }
            }
            nextPos = _iD;
        }
    });
    let nElem = document.getElementById(nextPos);
    if (nElem) {
        nElem.focus();
        return true;
    }
}
function shiftDown(iLine, iPos) {
    if (m_iPos == 0)
        m_iPos = iPos;
    let lDcnt = m_linDict.size;                                 // Anzahl Elemente Lines-Dict
    let nextPos = "-";
    let ef = false;
    if (iLine == lDcnt)                                         // war letzte Zeile?
        iLine = 0;                                                  // für 1. positionieren
    if (iLine < lDcnt) {                                        // akt. Zeile nicht letzte
        for (let nLine = iLine +1; nLine <= lDcnt; nLine++) {       // folgende Zeilen durchlaufen ...
            let dlInfo = m_linDict.get(nLine);                          // Zeilen-Info holen
            let aLinfo = dlInfo[2];                                         // Verzeichnis aktive Felder in Zeile
            ef = shift_DO(nLine.toString(), iPos, aLinfo);
            if (ef)
                break;
        }
    }
    if (ef)
        return ef;
    iLine = 0;
    for (let nLine = iLine +1; nLine <= lDcnt; nLine++) {       // folgende Zeilen durchlaufen ...
        let dlInfo = m_linDict.get(nLine);                          // Zeilen-Info holen
        let aLinfo = dlInfo[2];                                         // Verzeichnis aktive Felder in Zeile
        ef = shift_DO(nLine.toString(), iPos, aLinfo);
        if (ef)
            break;
    }
    return ef;
}

/**
 * Zeichen-Aktionen
 */

function TestVal(event, oVal) {
    function isUpperCase (inC) {  
        return inC === String(inC).toUpperCase();
      }
    let tval = oVal;
    let elem = event.target;
    if (elem.classList.contains("tfx-done"))
        return oVal;
    let iT = parseInt(elem.getAttribute("iT"));
    let doVal = false;
    /*  cDict - Key: Index Zeichen im Gesamt-Text /*
    /*  cDkenn-Struktur
                  Zeichen als Kleinbuchstaben
                  |       dto. als ASCII-Code numerisch
                  |       |       ist Großbuchstabe
                  |       |       |       korrespondierendes Scramble-Zeichen
                  |       |       |       |   dto. als ASCII-Code numerisch */
    //  cDkenn = [cASCII, ASCII_, isCap, "~", 0];
    //            0       1       2       3   4

    let _tval = event.key;                      // eingegebens Zeichen
    if (isUpperCase(_tval))                     // war Großbuchstabe ...
        _tval = String(_tval).toLowerCase();        // ... umsetzen auf Klein
    let cDkenn = m_cDict.get(iT);               // Infos zu Position holen
    if (_tval == cDkenn[0]) {                       // eingegebenes Zeichen = Klartext-Zeichen ?
        tval = cDkenn[0];                           // ... dann zuweisen ...
        let ctcnt = clearText(tval);                    // ... alle Felder mit Zeichen umsetzen
        if(cDkenn[2])
            tval = String(tval).toUpperCase();
        addValInfoV("Za", -1, KdCc.GET("doUpdZa"));   // Zähler 'Zeichen im Text' runterzählen - Optional
        addValInfoV("Zr", 1);                         // Zähler '- davon erkannt' hochzählen
        addValInfoV("Zc", 0-ctcnt);                   // Zähler 'noch verdeckt'
    } else {
        addValInfoV("Fv", 1);                       // Zähler 'Fehlversuche'
    }
    return tval;                                // Zeichen zurückgeben
}
function clearText(aC) {
    function clearTdline(tfx) {
        let tfx_a = tfx.split("-");
        let iLine = parseInt(tfx_a[1]);
        let dlInfo = m_linDict.get(iLine);
        let aLinfo = dlInfo[2];
        let fLi = aLinfo.findIndex(aktInd(tfx));
        if (fLi >= 0) {
            aLinfo.splice(fLi, 1);
            dlInfo[2] = aLinfo;
            m_linDict.set(iLine, dlInfo);
        }
        let fTa = m_linAr.findIndex(aktInd(tfx));
        if (fTa >= 0)
            m_linAr.splice(fTa, 1);
    }
    let _cTcnt = 0;                             // Zähler aufgedeckte Elemente
    let aDkenn = m_aDict.get(aC);
    /*  aDkenn = [aChar, aPos, lList, uList]; */
    let lList = aDkenn[2];
    let uList = aDkenn[3];
    lList.forEach( tfx => {
        let dfx = tfx.replace("text","done");
        clearTdline(tfx);
        let efx = document.getElementById(tfx);
        efx.setAttribute("id", dfx);
        efx.value = aC;
        efx.readonly = "readonly";
        efx.classList.toggle("tfx-done");
        _cTcnt += 1;
    });
    uList.forEach( tfx => {
        let dfx = tfx.replace("text","done");
        clearTdline(tfx);
        let efx = document.getElementById(tfx);
        efx.setAttribute("id", dfx);
        efx.value = aC.toUpperCase();
        efx.readonly = "readonly";
        efx.classList.toggle("tfx-done");
        _cTcnt += 1;
    });
    return _cTcnt;
}

export function TestClick() {
    let fElem = document.activeElement;
    let btnName = fElem.name;
    print(fElem.name, "CLICKed");
    switch(btnName) {
        case 'btnDA':
            DO_btnDA();
            break;
        case 'btnNT':
            DO_btnNT();
            break;
        default:
            // _text = KdCtext_de;
    }
}
function DO_btnNT() {
    toggle_MsgBox(false);

    mainExec_DO('NEXT');

}
function DO_btnDA() {
    toggle_MsgBox(false);

    let aDict = new Map();
    m_aDict.forEach((value, key) => {
        let aDkenn = value;
        aDkenn[2] = [];
        aDkenn[3] = [];
        m_aDict.set(key, aDkenn);
    });

    expandMap(aDict, m_aDict);

    let cDict = new Map();
    expandMap(cDict, m_cDict);

    let aText = [];
    aText = expandArray(m_aText);

    m_linAr.length = 0;

    makeLines_DO(aText, aDict, cDict);
}

function TestFlag() {
    let fElem = document.activeElement;
    let pElem = fElem.parentElement;
    let oElem = pElem.parentElement;
    let btnName = fElem.name;
    print(fElem.name, "CLICKed");
    if (pElem.classList.contains("flag-s")) {
        let pElem_c = oElem.children;
        for (let i=0; i<pElem_c.length; i++) {
            let celem = pElem_c[i];
            let clist = celem.classList;
            if (clist.contains("flag-b")) {
                celem.classList.toggle("flag-b");
                celem.classList.toggle("flag-s");
                break;
            } 
        }
        pElem.classList.toggle("flag-s");
        pElem.classList.toggle("flag-b");

        mainExec(btnName);
    }
}