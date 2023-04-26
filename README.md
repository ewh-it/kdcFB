[![License: GNU AGPLv3](https://img.shields.io/badge/https://img.shields.io/badge/AGPL-3.0-lightgrey.svg)]
![Latest Release](https://img.shields.io/github/v/release/ewh-it/kdcJS)

Knack-den-Code - erkenne den verschlüsselten Text!

* Copyright (C) 2019-2023 ewh-it - EW.H

Ein Text wird am Bildschirm verschlüsselt dargestellt, es gilt mit möglichst wenigen Fehlversuchen die korrekte Zuordnung der Zeichen zu erkennen.

## Inhalt

* [Beschreibung](#description)
  * [Bedienelemente](#userinterface)
  * [Architektur](#architecture)
  * [Noch zu tun](#TODO)
* [Voraussetzungen](#requirements)
* [Installation](#installation)
* [Upgrade](#upgrade)
* [Übersetzungen](#translation)
* [Support](#support)
* [Danksagungen](#thanks)
* [Lizenz](#license)

<a name="description"></a>
## Beschreibung

Ein Text wird verschlüsselt auf dem Schirm angezeigt, es gilt, mit möglichst wenig Fehlversuchen den Klartext zu bestimmen. Die Verschlüsselung bezieht sich nur auf die Alphabet-Zeichen, Ziffern, Leerzeichen und Satz- und Sonderzeichen werden im Klartext dargestellt. 
Ein Text kann mehrere Absätze beinhalten, jeder Absatz wird zu jeweils 40 Zeichen pro Darstellungsblock auf den Schirm gebracht. Hat ein Absatz mehr als 40 Zeichen, werden entsprechend weitere Darstellungsblöcke auf dem Schirm sein.
Es gibt maximal 9 Darstellungsblöcke, ein fortlaufender Text ohne Absätze kann also maximal 360 Zeichen inklusive Leer- und Satzzeichen enthalten.

Die Darstellungs-Sprache - aktuell Deutsch und Englisch - bestimmt den Zeichenvorrat und die Aufbereitungsregeln. Deutsch hat mit den Umlauten und dem 'ß' über die ASCII-Definition hinausgehende Buchstaben, wobei das 'ß' nur als Kleinbuchstabe definiert ist. Andere Sprachen können grundsätzlich eingebunden werden, solange ihre Zeichen dem deutschen Tastatur-Layout entsprechen. 
 
Die Mehrsprachigkeit basiert auf der i18n-Bibliothek von Simon Rodwell; die Bibliothek ist als lokales Element eingebunden. Die Beschriftungen der Oberflächen-Elemente werden über Kennungen abgerufen, die Inhalte sind sprachspezifisch hart codiert.

Die Texte werden der Reihe nach aufgerufen, es gibt keine Klassifizierung nach Inhalt und/oder Komplexität. Beim Sprachwechsel wird die Text-Kette jeweils von Beginn an durchlaufen, nach dem letzten Text beginnt der Durchlauf wieder von Position 1. Beim Wechsel wird jeder Text unabhängig verschlüsselt.

Die Verschlüsselung erfolgt über Zufallsverteilung.

<a name="userinterface"></a>
#### Bedienelemente

Der Verlauf der Entschlüsselung wird über Zählerfelder dokumentiert:
-  'Zeichen im Text' - Anzahl der im Text verwendeten Buchstaben: 'Test Test Test' ergibt den Wert 3
- '- davon erkannt' - wird bei jedem korrekt erkannten Buchstaben hochgezählt
- 'Fehlversuche' - wird bei jeder falschen Zuordnung hochgezählt
- 'noch verdeckt' - Gesamtzahl der noch nicht erkannten Buchstaben: 'Test Test Test' ergibt zu Anfang den Wert 12

Man kann eine laufende Sitzung mit Schaltflächen steuern:
- 'Noch mal' - Alle Zeichen werden wieder verdeckt angezeigt und die Zähler neu initialisiert. Die jeweils angewendete Verschlüsselung bleibt erhalten.
- 'Neuer Text' - Bricht die laufende Sitzung ab und ruft direkt den nächsten Text der Kette ab.

Sind alle Buchstaben korrekt erkannt, wird eine Erfolgsmeldung eingeblendet. 

<a name="architecture"></a>
#### Architektur

Die Anwendung beinhaltet ein Javascript-HTML-CSS-Frontend und ein Leaf-PHP-Api-Backend.

Das Frontend wird vom Browser betrieben, dieser untersagt es, aus einer Anwendung verdeckt ohne User-Interaktion auf Elemente des Dateisystems zuzugreifen. Damit müssten die Textinhalte explizit im Code beschrieben sein.

Leaf ist ein PHP-Framework. Es ist unabhängig vom Browser - PHP läuft im Server-Kontext - und kann auf Elemente des Dateisystems zugreifen. Die Texte können somit als einfache Text-Files in einem Verzeichnis hinterlegt werden, Inhalt und Anzahl lassen sich jederzeit durch unabhängige Aktionen steuern.

##### Frontend

Im Frontend läuft das User-Interface mit den Bedienelementen. 

#### Backend

Die Leaf-PHP-Api stellt die Texte über AJAX-Calls zur Verfügung. Bei jedem Wechsel der aktiven Sprache wird das gesamte jeweilige Inventar ausgeliefert.

* Leaf PHP ist in einer minimalen Konfiguration eingebunden - Leaf bare - mit Zusatz-Modulen FS(Filesystem) und Session. Siehe https://leafphp.dev/docs/cli/#creating-a-leaf-app für weitere Informationen.

<a name="TODO"></a>
#### Noch zu Tun
 
- Texte nach Inhalt und Komplexität kategorisieren, entsprechende Auswahl erlauben oder Level-System einbauen.
- Mehrsprachigkeit: Zurzeit wird nur das deutsche Tastatur-Layout unterstützt. Sprachen mit eigenen Tastatur-Layouts und entsprechend abweichenden und ergänzenden Zeichencodes können wohl dargestellt, andere Tastatur-Layouts müssen dann aber über Bildschirm-Tastatur und virtuelle Keyboards nachgebildet werden.

<a name="requirements"></a>
## Voraussetzungen

Dieses Modul ist standalone, es gibt keine Abhängigkeiten, alle Elemente sind im Download enthalten.
Das Frontend-Modul im Browser ist Vanilla-JavaSript im ES6-Standard. Das Backend ist Leaf-PHP.

<a name="installation"></a>
## Installation

1. Laden Sie die [Neueste Version] (https://github.com/ewh-it/KdC-js/releases/latest) herunter.
2. Entpacken Sie es in ein Verzeichnis <ihre Wahl> auf dem Webserver.

<a name="upgrade"></a>
## Upgrade

Um die neueste Version zu erhalten, ersetzen Sie einfach die vorhandenen KdC-Dateien mit denen der neuesten Version.

<a name="translation"></a>
## Übersetzungen

Eine Sprache wird beschrieben durch
- Zeichenvorrat - in KdCconfig.js
- Meldungstexte und Beschriftungen - in KdCtranslate.js
- Text-Inventar - Server-Verzeichnis ./texte/{lang}/text[n].txt

<a name="support"></a>
## Support

<span style="font-weight: bold;">Issues: </span>Fehler bitte in diesem GitHub-Repository melden.

<a name="thanks"></a>
## Danksagungen

* **i18n**    : Simon Rodwell und Mitgestalter https://github.com/roddeh/i18njs
* **Leaf PHP**: Michael Darko und Mitgestalter https://github.com/leafsphp https://leafphp.dev/docs/introduction/

<a name="license"></a>
## Lizenz

* (AGPL-3.0-or-later)

In Schlagworten bedeutet das: GNU Affero General Public License v3.0.
Die Lizendefinition kann unter https://choosealicense.com/licenses/agpl-3.0/
eingesehen werden.
