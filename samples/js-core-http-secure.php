<?php

include __DIR__ . '/SecureRequestHelper.php';



// charset
header("Content-Type: application/json; charset=utf-8");

// no cache
header("Expires: Sat, 1 Jan 2005 00:00:00 GMT");
header("Last-Modified: ".gmdate( "D, d M Y H:i:s")." GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");	


$sechelper = new SecureRequestHelper('myCSRF', 'myCSRFparameter');
$authorized = $sechelper->authorizeCSRF($_POST) ? 'yes':'no';

echo json_encode("Received : " . print_r($_POST, true) . 'and cookies : ' . print_r($_COOKIE,true) . "Authorized: $authorized");


	


?>