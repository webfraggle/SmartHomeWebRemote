<?php
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');
error_reporting(-1);
ini_set('error_reporting', E_ALL);
ini_set('display_errors', true);
/*
* Authentication to Netatmo Servers using Authorization grant.
* This script has to be hosted on a webserver in order to make it work
* For more details about Netatmo API, please take a look at https://dev.netatmo.com/doc
*/

define('__ROOT__', dirname(__FILE__).'/Netatmo-API-PHP');
require_once (__ROOT__.'/src/Netatmo/autoload.php');

require_once 'config.php';

$tokens_file = file_get_contents('auth.inc.php');
$tokens = unserialize($tokens_file);



//API client configuration
$config = array("client_id" => $client_id,
                "client_secret" => $client_secret,
                "scope" => Netatmo\Common\NAScopes::SCOPE_READ_STATION,
				"refresh_token" => $tokens['refresh_token'],
				"access_token" => $tokens['access_token']);
				
$client = new Netatmo\Clients\NAWSApiClient($config);

//retrieve user's weather station data
    try{
        $data = $client->getData();
    }
    catch(Netatmo\Exceptions\NAClientException $ex)
    {
       echo "An error occured while retrieving data: ". $ex->getMessage()."\n";
       die();
    }
	
	// print_r($data);
	
	$out = array();

	$out['outside'] = $data['devices'][0]['modules'][0]['dashboard_data'];
	$out['inside'] = $data['devices'][0]['dashboard_data'];
	print json_encode($out);
die();



?>