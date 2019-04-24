myApp.factory('hueService', ['$http',function($http) {
  return {
    ip:hue_ip,
    key:hue_key,
    url:hue_url,
    // briTable:[0, 1, 2, 2, 2, 3, 3, 4, 5, 6, 7, 8, 10, 11, 13, 16, 19, 23,
    //   27, 32, 38, 45, 54, 64, 76, 91, 108, 128, 152, 181, 215, 254],
    lights:[],
    groups:[],
    rooms:[],
    busy: false,
    onChange:function()
    {},
    onChangeGroups:function()
    {},
    getNearestBriId:function(v)
    {
      var c = 1000;
      var ret = -1;
      for (var i=0;i<this.briTable.length;i++)
        {
          // console.log(v, this.briTable[i], c, v-this.briTable[i], ret)
          if (Math.abs(v-this.briTable[i]) < c)
          {
            c = Math.abs(this.briTable[i]-v);
            ret = i;
          }
        }
        return ret;
    },
    switchLight:function(id,state)
    {
      console.log('switchLight', id,state);
      $http({
        method : 'PUT',
        url : this.url+'lights/'+id+'/state',
        data : {"on": state}
      }).then(function successCallback(response) {
        console.log('switchLight response', response);
      }, function errorCallback(response) {
        console.log('switchLight Erros response', response);
        
      });
    },
    setBrightness:function(id,bri)
    {
      var $this = this;
      // console.log(this.briTable.length);
      // console.log(Math.floor(bri*255));
      // var pos = Math.floor(bri*31);
      // var bri2 = this.briTable[pos];
      // if ($this.busy) return;
      $this.busy = true;
      $this.getLightById(id).busy = true;
      // console.log(id,bri);

      $http({
        method : 'PUT',
        url : this.url+'lights/'+id+'/state',
        data : {"on": true, "bri":bri},
        id: id
      }).then(function successCallback(response) {
        // console.log('response', response.config.id);
        $this.getLightById(response.config.id).busy = false;
        $this.busy = false;
      }, function errorCallback(response) {
        $this.getLightById(response.config.id).busy = false;
        $this.busy = false;
        
      });
    },
    setColorTemperature:function(id,ct)
    {
      var $this = this;
      $this.busy = true;
      $this.getLightById(id).busy = true;
      console.log(id,ct);

      $http({
        method : 'PUT',
        url : this.url+'lights/'+id+'/state',
        data : {"on": true, "ct":ct},
        id: id
      }).then(function successCallback(response) {
        $this.getLightById(response.config.id).busy = false;
        $this.busy = false;
      }, function errorCallback(response) {
        $this.getLightById(response.config.id).busy = false;
        $this.busy = false;
        
      });
    },
    
    setHue:function(id,hue)
    {
      var $this = this;
      $this.busy = true;
      $this.getLightById(id).busy = true;
      console.log(id,hue);

      $http({
        method : 'PUT',
        url : this.url+'lights/'+id+'/state',
        data : { "colormode": 'hue', "hue":hue, "sat":254},
        id: id
      }).then(function successCallback(response) {
        $this.getLightById(response.config.id).busy = false;
        $this.busy = false;
      }, function errorCallback(response) {
        $this.getLightById(response.config.id).busy = false;
        $this.busy = false;
        
      });
    },
    
    getLightById:function(id)
	{
		id = ''+id;
		for(var i=0,j=this.lights.length; i<j; i++){
		  if (this.lights[i].id == id) return this.lights[i];
		  
		};
  },
  update:function()
    {
      var $this = this;
      $http({
        method : 'GET',
        url : this.url+'lights'
      }).then(function successCallback(response) {
        for (var lightNr in response.data)
        {
          var light = $this.getLightById(lightNr);
          var t = response.data[lightNr];
          //console.log(light);
          if (!light)
          {
           
            t.id = lightNr;
            $this.lights.push(t);
          } else {
            light.state = angular.copy(t.state);
          }
          
        };
        $this.onChange();
      }, function errorCallback(response) {
        console.log(response.status);
        
      });
    },
    updateGroups:function()
    {
      var $this = this;
      $http({
        method : 'GET',
        url : this.url+'groups'
      }).then(function successCallback(response) {
        console.log(response);
        $this.groups = [];
        $this.rooms = [];
        for (var groupNr in response.data)
        {
          var t = response.data[groupNr];
          $this.groups.push(t);
          if (t.type == "Room")
          {
            $this.rooms.push(t);
          }
          
        };
        $this.onChangeGroups();
      }, function errorCallback(response) {
        console.log(response.status);
        
      });
    }
  
  };
}]);