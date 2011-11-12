<?php

$filesArray = array();
$Counter = 0;
$files = scandir($_POST["name"]);
foreach ($files as &$file)
{
 if ($file!='.' && $file!='..' )
 {
  $filesArray[$Counter] = $file;
  echo $filesArray[$Counter].'<br>';
  $Counter = $Counter + 1;

 }
}
return $filesArray;
