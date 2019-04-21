<?php


function  getToken()
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://my.tado.com/oauth/token"); 
    curl_setopt($ch, CURLOPT_POSTFIELDS, 'client_id=tado-web-app&client_secret=GOOGLE FOR TADO CLIENT SECRET&grant_type=password&scope=home.user&username=ADD_USERNAME&password=ADD_PASSWORD');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    $output = curl_exec($ch);
    
    $credentials = json_decode($output);
    
    
    $credentials->time = time();
    $serialize = serialize($credentials);
    file_put_contents('auth.inc.php',$serialize);
    curl_close($ch);
    return $serialize;
}
?>