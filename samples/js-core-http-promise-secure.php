<?php

// charset
header("Content-Type: application/json; charset=utf-8");

// no cache
header("Expires: Sat, 1 Jan 2005 00:00:00 GMT");
header("Last-Modified: ".gmdate( "D, d M Y H:i:s")." GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");	

echo json_encode(array('status'=>true, 'message'=>"Received payload : " . print_r($_POST, true) . 'and cookies : ' . print_r($_COOKIE,true)));


?>