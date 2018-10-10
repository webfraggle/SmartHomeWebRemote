<?php

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

//API client configuration
$config = array("client_id" => $client_id,
                "client_secret" => $client_secret,
                "scope" => Netatmo\Common\NAScopes::SCOPE_READ_STATION);
$client = new Netatmo\Clients\NAWSApiClient($config);

//if code is provided in get param, it means user has accepted your app and been redirected here
if(isset($_GET["code"]))
{
    //get the tokens, you can store $tokens['refresh_token'] in order to quickly retrieve a new access_token next time
    try{
        $tokens = $client->getAccessToken();
		print_r($tokens);
		file_put_contents('auth.inc.php', serialize($tokens));
		
    }
    catch(Netatmo\Exceptions\NAClientException $ex)
    {
        echo "An error occured while trying to retrieve your tokens \n";
        echo "Reason: ".$ex->getMessage()."\n";
        die();
    }
    
}
else {
    // OAuth returned an error
    if(isset($_GET['error']))
    {
        if($_GET['error'] === "access_denied")
            echo " You refused to let this application access your Netatmo data \n";
        else echo "An error occured";
    }
    //user clicked on start button => redirect to Netatmo OAuth
    else if(isset($_GET['start']))
    {
        //Ok redirect to Netatmo Authorize URL
        $redirect_url = $client->getAuthorizeUrl();
        header("HTTP/1.1 ". 302);
        header("Location: " . $redirect_url);
        die();
    }
    // Homepage : start button
    else
    {
?>
<html>
    <body>
       <form method="GET" action="<?php echo $client->getRequestUri();?>">
           <input type='submit' name='start' value='Start'/>
       </form>
    </body>
</html>
<?php
    }
}

?>