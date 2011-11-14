<?php
$filename = $_POST["name"]; 
$fd  = fopen($filename, "r");
$fileString = fread($fd,filesize($filename));
fclose($fd);
echo $fileString;
