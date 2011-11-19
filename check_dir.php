<?php

$dirname = $_POST["name"];
if (Is_dir($dirname) == true)
    echo "true $dirname";
else
    echo "false $dirname";
