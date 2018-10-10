<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");

header('Content-Type: application/json');


include('functions.inc.php');

$temp = file_get_contents('auth.inc.php');



$credentials = unserialize($temp);

// print $credentials->access_token;
// print_r($credentials);
$expires = $credentials->time+$credentials->expires_in-time();

if ($expires<450)
{
    $credentials = unserialize(getToken());
}
// print ($expires);
// exit;

switch ($_GET['t'])
{
    case 'homes':
        // .../tado_api/get.php?t=homes&id=130130
        $myURL = "https://my.tado.com/api/v2/homes/".$_GET['id'];
        
    break;
        
    case 'devices':
    case 'zones':
        // .../tado_api/get.php?t=devices&id=130130
        $myURL = "https://my.tado.com/api/v2/homes/".$_GET['id']."/".$_GET['t'];
    break;
    case 'zonestate':
        // .../get.php?t=zonestate&id=130130&zoneid=1
        $myURL = "https://my.tado.com/api/v2/homes/".$_GET['id']."/zones/".$_GET['zoneid']."/state";
    break;
    case 'setTemp':
        $myURL = "https://my.tado.com/api/v2/homes/".$_GET['id']."/zones/".$_GET['zoneid']."/overlay";
        $putData = '{"setting":{"type":"HEATING","power":"ON","temperature":{"celsius":'.$_GET['temperature'].'}},"termination":{"type":"TADO_MODE"}}';
    break;
    case 'removeTemp':
        $myURL = "https://my.tado.com/api/v2/homes/".$_GET['id']."/zones/".$_GET['zoneid']."/overlay";
    break;
    default:
        $myURL = "https://my.tado.com/api/v2/me";
    break;
}

$headers = array(
    "Authorization: Bearer ".$credentials->access_token
);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $myURL);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
if (isset($putData))
{
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($curl, CURLOPT_POSTFIELDS, $putData);
    array_push($headers,"Content-Type:application/json;charset=UTF-8");
}
if ($_GET['t']=="removeTemp")
{
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
}
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);


$out = curl_exec($curl);

print $out;

?>