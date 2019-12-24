<?php

// charset
header("Content-Type: application/json; charset=utf-8");

// no cache
header("Expires: Sat, 1 Jan 2005 00:00:00 GMT");
header("Last-Modified: ".gmdate( "D, d M Y H:i:s")." GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");	

$r = "Received payload : " . print_r($_POST, true);

if ( count($_FILES) )
	foreach ( $_FILES as $f )
	{
		$r .= "<br>and file upload content '" . $f['name'] . "' : ";
		$r .= file_get_contents($f['tmp_name']);
		unlink ($f['tmp_name']);
	}

echo json_encode($r);


?>