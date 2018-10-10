<?php
header('Access-Control-Allow-Origin: *'); 
//header('Content-Type: application/json');
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
// 	print json_encode($out['outside']['Temperature']);
// die();
$im = imagecreatetruecolor (128, 64);
$black = ImageColorAllocate ($im, 0, 0, 0);
$white = ImageColorAllocate ($im, 255, 255, 255);
ImageTTFText ($im, 20, 0, 0, 20, $white, "/fonts/arialbd.ttf", 
$out['inside']['Temperature']."°C");
ImageTTFText ($im, 20, 0, 0, 48, $white, "/fonts/arialbd.ttf", 
$out['outside']['Temperature']."°C");
// imagefilledrectangle($im,2,0,127,5,$white);
// imagefilledrectangle($im,0,8,127,12,$white);
// imagefilledrectangle($im,0,21,101,35,$white);

//imagefilter($im, IMG_FILTER_GRAYSCALE);
//imagefilter($im, IMG_FILTER_CONTRAST, -100);
// Header ("Content-type: image/gif");
//     ImageGif ($im);
//     die();
    // $p1 = 0;
    // $p2 = 0;
    // $p3 = 0;
    // $p4 = 0;
    // $p5 = 1;
    // $p6 = 1;
    // $p7 = 1;
    // $p8 = 1;
    // // $byte = $p8 << 7 | $p7 << 6;
    // $byte = $p1 << 7 | $p2 << 6 | $p3 << 5 | $p4 << 4 | $p5 << 3 | $p6 << 2 | $p7 << 1 | $p8;

    // print $byte;

    // die();
    // $bytes = array();
//     for($j=0;$j<8;$j++)
//     {
//     for($i=0;$i<128;$i++)
//     {
//             $p1 = (imagecolorat($im, $i, $j*8+0)>>16) > 127;
//             $p2 = (imagecolorat($im, $i, $j*8+1)>>16) > 127;
//             $p3 = (imagecolorat($im, $i, $j*8+2)>>16) > 127;
//             $p4 = (imagecolorat($im, $i, $j*8+3)>>16) > 127;
//             $p5 = (imagecolorat($im, $i, $j*8+4)>>16) > 127;
//             $p6 = (imagecolorat($im, $i, $j*8+5)>>16) > 127;
//             $p7 = (imagecolorat($im, $i, $j*8+6)>>16) > 127;
//             $p8 = (imagecolorat($im, $i, $j*8+7)>>16) > 127;

//     //             $p1 = false;
//     // $p2 = true;
//     // $p3 = false;
//     // $p4 = true;
//     // $p5 = false;
//     // $p6 = true;
//     // $p7 = false;
//     // $p8 = true;
// // var_dump($p1);
//             // print $i."-".$j."\n";
//             // $byte = $p1 << 7 | $p2 << 6 | $p3 << 5 | $p4 << 4 | $p5 << 3 | $p6 << 2 | $p7 << 1 | $p8;
//             $byte = ($p8 & 0x01) << 7 | ($p7 & 0x01) << 6 | ($p6 & 0x01) << 5 | ($p5 & 0x01) << 4 | ($p4 & 0x01) << 3 | ($p3 & 0x01) << 2 | ($p2 & 0x01) << 1 | ($p1 & 0x01) << 0;
//             // print $byte."|";
//             //array_push($bytes, $byte);
//             print str_pad(dechex($byte),2,"0");
//         }

        
//     }

$cols    = 128;
$rows    = 64;
$lcdArr  = array();
$index   = 0;

// generate the array
for ($i = 0; $i < $rows; $i += 8)   // page index
{
    for ($j = 0; $j < $cols; $j++)    // column index
    {
        // find the current lcd index
        $index   = ($i * $cols)/8 + $j;

        // initialize the lcd datapoint
        $lcdArr[$index]   = 0;
        
        // loop through the rows in this current page+column 
        for ($k = 0; $k < 8; $k++)       // row index
        {
            //console.log("page: " + i + ", column: " + j + ", bit: " + k + ",   lcd index = " + index);

            // find if this pixel should be represented by black or white
            // $val     = colorToBlackOrWhite(imageData, j, i+k);

            $val = (imagecolorat($im, $j, $i+$k)>>16) > 127;

            // push the b+w value into the byte
            //  lcd byte ordering:
            //      LSB is at the top of the page
            $lcdArr[$index]   = $lcdArr[$index] | (($val & 0x01) << $k);
        }
    }
}   
// print count($lcdArr);
for ($i=0;$i<count($lcdArr);$i++)
{
    print str_pad(dechex($lcdArr[$i]),2,"0",STR_PAD_LEFT);
}
    // pack("H*",$bytes);
    ImageDestroy ($im);
die();



?>