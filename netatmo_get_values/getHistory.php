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
    $date_begin = time() -24*3600;
    $date_begin = floor($date_begin / (15 * 60)) * (15 * 60); // rounded to quarter
    $date_end = time(); //now
    $scale = "30min";

    foreach ($data['devices'] as $device)
    {
        array_unshift($device['modules'], $device);
        foreach ($device['modules'] as $module)
        {
            $out[$module['module_name']] = array();
            $types = [];
            foreach ($module['data_type'] as $type)
            {
                $types[] = $type;
                $out[$module['module_name']][$type] = [];
            }
            $type = implode(',',$types);
            $measurements = $client->getMeasure($device['_id'], $module['_id'], $scale, $type, $date_begin, $date_end);//, $optimized, $real_time);
            $out[$module['module_name']]['beg_time'] = $measurements[0]['beg_time'];
            $out[$module['module_name']]['step_time'] = $measurements[0]['step_time'];
            foreach ($measurements[0]['value'] as $values)
            {
                foreach ($values as $k => $v)
                {
                    $out[$module['module_name']][$types[$k]][] = $v;
                }
            }
            // print_r($measurements);
            
        }
    }
    // print_r($out);
    print json_encode($out);
	exit;
    if (isset($data['devices'][0]['modules'][0]['dashboard_data']))
    {
        $out['outside'] = $data['devices'][0]['modules'][0]['dashboard_data'];
    }
	$out['inside'] = $data['devices'][0]['dashboard_data'];
	print json_encode($out);
die();



?>