<?php
  $file = fopen($_POST["name"] , "w") or die("error");
  fwrite($file, $_POST["data"]);
  fclose($file);
  echo "saved";

