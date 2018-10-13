# Smart Home Web Remote
A Web Remote for the Philips Hue, Tado and Netatmo

For use with raspberry pi touch display or a smartphone.

This is not for beginners, because you need many tokens and some knowledge about apis.

<img src="https://raw.githubusercontent.com/webfraggle/HueWebRemote/master/images/smarthomeDisplay.png" height="320px" align="left">
<img src="https://raw.githubusercontent.com/webfraggle/HueWebRemote/master/images/foto1.jpg" height="320px" align="left">
<img src="https://raw.githubusercontent.com/webfraggle/HueWebRemote/master/images/foto2.jpg" height="320px" >



Rename js/config.example.js to js/config.js and add your credentials.

## Tado:
Located in tado_api. You need an access token. To get the token use getToken.php but change username and password first in that file.
Change settings in js/config.js

## Netatmo:
To authorize your app, please subscribe for a developer account, register a new app and rename config.example.php to config.php and add your credentials. After that use auth.php to get an access token.
Change settings in js/config.js

## Hue
Please google, how to get an Hue token.
Change settings in js/config.js

You also need the font PE Icon 7 from here:
https://www.pixeden.com/icon-fonts/stroke-7-icon-font-set
because I didn't know the license

To start deving:

npm install

npm run dev

http://localhost:3000
