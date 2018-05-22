<?php
$local = (isset($_POST['local'])) ? $_POST['local'] : '';

$files = scandir('drive/'.$local);
unset($files[0]);
unset($files[1]);
$f = [];
foreach ($files as $key => $value) {

  if(is_dir("drive/".$local."/".$value)) {
    $f[] = ['type'=>'dir', "name"=>$value, 'path'=>$local.$value."/"];
  } else {
    $f[] = ['type'=>'file', 'name'=>$value, 'path'=>'drive'.$local.$value];
  }
}

header("Content-Type: application/json");
$data['error'] = false;
echo json_encode($f);
