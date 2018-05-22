<?php

$path = (isset($_POST['path'])) ? $_POST['path'] : '';
$local = (isset($_POST['local'])) ? $_POST['local'] : '';
$local = substr($local, 1, strlen($local));
$local = $local."/";

if(!empty($path)) {
  if(!file_exists("drive/".$local.$path)) {
    mkdir("drive/".$local.$path, 0750, true);
  }
}

move_uploaded_file($_FILES['file']['tmp_name'], 'drive/'.$local.$path.$_FILES['file']['name']);

$data['error'] = false;
header("Content-Type: application/json");
echo json_encode($data);
