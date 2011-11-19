<?php

$filesArray = array();
$Counter = 1;
$files = scandir($_POST["name"]);
$isdirflag = $_POST["isdir"];
// always the index 0 is the orginal path name 
$filesArray[0] = $_POST["name"];
echo $filesArray[0].'<br>';
foreach ($files as &$file) {
    if ($file!='.' && $file!='..' ) {
        if ($isdirflag && Is_dir($file)) {
            $filesArray[$Counter] = $file;
            echo $filesArray[$Counter].'<br>';
            $Counter = $Counter + 1;
            } else {
                $filesArray[$Counter] = $file;
                echo $filesArray[$Counter].'<br>';
                $Counter = $Counter + 1;            
            }
        }      
    }
return $filesArray;
