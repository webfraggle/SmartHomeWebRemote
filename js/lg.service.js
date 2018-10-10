/**
 * Launch Points:
 * https://github.com/hobbyquaker/lgtv2#commands
 * https://github.com/ConnectSDK/Connect-SDK-Android-Core/blob/master/src/com/connectsdk/service/WebOSTVService.java
 */
myApp.factory('lgService', ['$http',function($http) {
  return {
    ip:'raspberrypi',
    port:'8080',
    ws:null,
    volume:-1,
    muted:false,
    apps:[],
    onChange:function()
    {},
    start:function()
    {
        $this = this;
        this.ws = new WebSocket('ws://'+this.ip+':'+this.port);
        this.ws.onopen = function () {
            console.log('opened')
          };
          
          // Log errors
          this.ws.onerror = function (error) {
            console.log('WebSocket Error ' + error);
          };
          
          // Log messages from the server
          this.ws.onmessage = function (e) {
            // console.log('Server: ' + e.data);
            $this.parseData(e.data);
          };

    },
    parseData:function(data)
    {
        data = JSON.parse(data);
        console.log(data);
        if (data.muted != null || data.muted != undefined)
        {
            this.volume = data.volume;
        }
        if (data.muted != null || data.muted != undefined)
        {
            this.muted = data.muted;
        }
        if (data.launchPoints)
        {
            this.launchPoints = data.launchPoints;
        }
        if (data.apps)
        {
            this.apps = data.apps;
            this.getForegroundApp();
        }
        if (data.appId)
        {
            this.currentApp = this.getAppByID(data.appId);
            this.onChange();
            // console.log('currentApp',this.currentApp);
        }

    },
    send:function(string)
    {
        // console.log(this.ws.readyState);
        if (this.ws.readyState == 1) this.ws.send(string);
    },
    getAppByID:function(id)
    {
        if (this.apps.length <= 0)
        {
            this.updateApps();
        }
        for (i=0;i<this.apps.length;i++)
        {
            if (this.apps[i].id == id)
            {
                return this.apps[i];
            }
        }
        return null;
    },
    volumeUp:function()
    {
        this.send('{"task":"volumeUp"}');
    },
    volumeDown:function()
    {
        this.send('{"task":"volumeDown"}');
    },
    launch:function(what)
    {
        this.send('{"task":"launch","id":"'+what+'"}');
    },
    listLaunchPoints:function()
    {
        this.send('{"task":"rawCmd","cmd":"com.webos.applicationManager/listLaunchPoints"}');
    },
    updateApps:function()
    {
        this.send('{"task":"rawCmd","cmd":"com.webos.applicationManager/listApps"}');
    },
    getAppStatus:function()
    {
        this.send('{"task":"rawCmd","cmd":"com.webos.service.appstatus/getAppStatus"}');
    },
    getForegroundApp:function()
    {
        this.send('{"task":"rawCmd","cmd":"com.webos.applicationManager/getForegroundAppInfo"}');
    },
    getServiceList:function()
    {
        this.send('{"task":"rawCmd","cmd":"api/getServiceList"}');
    },
    rawCmd:function(cmd)
    {
        this.send('{"task":"rawCmd","cmd":"'+cmd+'"}');
    },
    click:function()
    {
        this.send('{"task":"click"}');
    },
    button:function(btn)
    {
        this.send('{"task":"button","keyName":"'+btn+'"}');
    },

  };
}]);