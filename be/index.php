<?php

use Leaf\FS;

require __DIR__ . '/vendor/autoload.php';

app()->get('/', function () {
	response()->page('./welcome.html');
});

// app()->get('/texte/{lang}', function ($lang) {
//     echo"{$lang}";
// });

app()->get('/texte', function () {
    $request = request()->body();
    $lang = request()->params('lang','de');
    $id = request()->params('id', 'alle');

    if ($id == 'alle') {
        $tlist = FS::listDir('../texte/' . $lang);
        $texte = [];
        $cnt = sizeof($tlist);
        for ($i = 0; $i < $cnt; $i++) { 
            $tfil = $tlist[$i];
            $tfil_p = explode('.', $tfil);
            if ($tfil_p[1] == 'txt') {
                $text = FS::readFile('../texte/' . $lang . '/' . $tfil);
                $texte[$tfil_p[0]] = $text;
            }
        }
        ksort($texte);
        response()->json($texte);
    } else {
        $text = FS::readFile('../texte/' . $lang . '/text' . $id . '.txt');
        response()->json($text);
    }
});

app()->run();
