/**
 * Knack-den-Code - KdC
 * Copyright 2022/23 EW.Heinrich
 * This code is licensed under an GPL-3.0 License.
 *   Parts of the code in externally referenced modules may be subject to other licenses.
 * 
 * Allgemeine Hilfs-Funktionen
 * 
 */


/**
 * Wrapper für Log-Funktion
 */
export function print(...data) {
    console.log(data.join());
}
/**
 * Map by Value neu aufbauen
 * sMap     -> neue Map s(et)Map
 * qMap     -> vorhandene Map q(uell)Map
 */
export function expandMap(sMap, qMap) {
    qMap.forEach((value, key) => {
        if (sMap.has(key)) {
            let _value = sMap.get(key);
            sMap.set(key, _value);
        } else {
            sMap.set(key, value);
        }
    });
}
/**
 * Array by Value neu aufbauen
 * sArray     -> neues Array s(et)Array
 * qArray     -> vorhandenes Array q(uell)Array
 */
export function expandArray(qArray) {
    let _qString = qArray.join("€");
    let sArray = _qString.split("€");
    return sArray;
    // qArray.forEach( (elem) => {
    //     if (!sArray.includes(elem))
    //         sArray.push(elem);
    // });
}
/**
 * Helper-Funktion - 2-stelliger Index-String
 */
export function strNN(iV) {
    /* 2-stellige Index-Werte sicherstellen */
    let strN = String(iV);
    if (iV < 10)
        strN = '0' + strN;
    return strN;
}
