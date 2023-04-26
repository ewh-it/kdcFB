/**
 * 
 * Knack-den-Code - KdC
 * Copyright 2022/23 EW.Heinrich
 * This code is licensed under an GPL-3.0 License.
 *   Parts of the code in externally referenced modules may be subject to other licenses.
 * 
 * Text-Files laden und bereitstellen
 * 
 */

export function loadFiles(langCode) {
    let list_files = [];
    let _location = window.location.pathname;
    console.log(_location);
    list_files = ["text1.txt", "text2.txt", "text3.txt", "text4.txt", "text5.txt"];
    return list_files;
}

export function readData(file_) {
    let _content = ["Test Test", "Test", "Test", "Test", "Test", "Test", "Test", "Test", "Test"];
    return _content;
}
