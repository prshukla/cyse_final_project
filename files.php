<?php
// list all files in the files directory
foreach(glob("json/*.json") as $filename){
  echo "<div class='file'>" .  $filename . "</div>";
}