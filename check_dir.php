<?php

$dirname = $_POST["name"];
if (is_dir($dirname) == true)
    echo "true $dirname";
else
    echo "false $dirname";
