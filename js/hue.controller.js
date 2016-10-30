function hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        //return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		return "#" + componentToHex(Math.round(r * 255)) + componentToHex(Math.round(g * 255)) + componentToHex(Math.round(b * 255));


    }

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

angular.module('gui.hue', []).controller('HueCtrl', function HueCtrl($scope, $interval, $timeout,$rootScope,$http) {
	
	$scope.ip = '192.168.178.54';
	$scope.key = '87wTw9H651KevYIWhQl2cw7K8KioqN4eLGe0N1Fv';
	$scope.url = 'http://'+$scope.ip+'/api/'+$scope.key+'/';
	$scope.lights = [];

	$scope.ctLightType = 'Color temperature light';
	$scope.colorLightType = 'Extended color light';

	$scope.test = 50;
	
	$scope.briSliderOptions = {
		    floor: 0,
		    ceil: 254,
		    vertical: false
		};
	$scope.ctSliderOptions = {
		    floor: 153,
		    ceil: 500,
		    vertical: false
		};
	$scope.hueSliderOptions = {
		    floor: 0,
		    ceil: 65535,
			step: 655,
			getPointerColor: function(v){
				return hslToRgb(v/65535,1,.5);
			},
			hideLimits: true,
			showSelectionBar: true,
			//showTicks: true,
			//getTickColor: function(){},

		    vertical: false
		};
	$scope.init = function() {
		console.log('start HueCtrl');
		$scope.updateLights();
		

	};
	
	$scope.updateLights = function()
	{
		$http({
			method : 'GET',
			url : $scope.url+'lights'
		}).then(function successCallback(response) {
			//console.log(response.data);
			// for (var i=0; i < response.data.length; i++) {
			for (var lightNr in response.data)
			{
				var light = $scope.getLightById(lightNr);
				var t = response.data[lightNr];
				//console.log(light);
				if (!light)
				{
					
				
					t.options = angular.copy($scope.briSliderOptions);
					t.options.id = lightNr;
					if (t.type == $scope.ctLightType || t.type == $scope.colorLightType)
					{
						t.optionsCt = angular.copy($scope.ctSliderOptions);
						t.optionsCt.onChange = $scope.setColorTemperature;
						t.optionsCt.id = lightNr;
					}
					if (t.type == $scope.colorLightType)
					{
						t.optionsHue = angular.copy($scope.hueSliderOptions);
						t.optionsHue.onChange = $scope.setHue;
						t.optionsHue.id = lightNr;
					}
					t.id = lightNr;
					t.options.onChange = $scope.handleChange;
					console.log(t);
					$scope.lights.push(t);
				} else {
					light.state = angular.copy(t.state);
				}
				
			};
			//console.log($scope.lights);
		}, function errorCallback(response) {
			console.log(response.status);
			
		});
	};
	
	$scope.getLightById = function(id)
	{
		id = ''+id;
		for(var i=0,j=$scope.lights.length; i<j; i++){
		  if ($scope.lights[i].id == id) return $scope.lights[i];
		  
		};
	};
	
	$scope.switchLight = function(id, what)
	{
		
		  var theLight = $scope.getLightById(id);
		  console.log(theLight);
		  $http({
			method : 'PUT',
			url : $scope.url+'lights/'+theLight.id+'/state',
			data : {"on": what}
		});
	};
	$scope.switchAllLights = function(what)
	{
		
		for (var i=0; i < $scope.lights.length; i++) {
		  var theLight = $scope.lights[i];
		  console.log(theLight);
		  $http({
			method : 'PUT',
			url : $scope.url+'lights/'+theLight.id+'/state',
			data : {"on": what}
		});
		};
	};
	
	$scope.handleChange = function(id)
	{
		// console.log('id', id);
		var theLight = $scope.getLightById(id);
		if (theLight.busy) return;
		
		theLight.busy = true;
		$http({
			method : 'PUT',
			url : $scope.url+'lights/'+theLight.id+'/state',
			data : {"on": true, "bri":theLight.state.bri}
		}).then(function successCallback(response) {
			// console.log(response.data);
			for (i in response.data)
			{
				if(response.data[i].success)
				{
					for (str in response.data[i].success)
					{
						
						// console.log(str);
						var id = str.replace(/[^0-9\.]/g, '');
						// console.log('resp id', id);
						var theLight = $scope.getLightById(id);
						theLight.busy = false;
					}
					
				}
			}
			
		}, function errorCallback(response) {
			console.log(response.status);
			
		});
		
	};

	$scope.setColorTemperature = function(id)
	{
		// console.log('id', id);
		var theLight = $scope.getLightById(id);
		if (theLight.busy) return;
		
		theLight.busy = true;
		$http({
			method : 'PUT',
			url : $scope.url+'lights/'+theLight.id+'/state',
			data : { "colormode": 'ct', "ct":theLight.state.ct}
		}).then(function successCallback(response) {
			// console.log(response.data);
			for (i in response.data)
			{
				if(response.data[i].success)
				{
					for (str in response.data[i].success)
					{
						
						// console.log(str);
						var id = str.replace(/[^0-9\.]/g, '');
						// console.log('resp id', id);
						var theLight = $scope.getLightById(id);
						theLight.busy = false;
					}
					
				}
			}
			
		}, function errorCallback(response) {
			console.log(response.status);
			
		});
		
	};

	$scope.setHue = function(id)
	{
		// console.log('id', id);
		var theLight = $scope.getLightById(id);
		if (theLight.busy) return;
		
		theLight.busy = true;
		$http({
			method : 'PUT',
			url : $scope.url+'lights/'+theLight.id+'/state',
			data : { "colormode": 'hue', "hue":theLight.state.hue, "sat":254}
		}).then(function successCallback(response) {
			// console.log(response.data);
			for (i in response.data)
			{
				if(response.data[i].success)
				{
					for (str in response.data[i].success)
					{
						
						// console.log(str);
						var id = str.replace(/[^0-9\.]/g, '');
						// console.log('resp id', id);
						var theLight = $scope.getLightById(id);
						theLight.busy = false;
					}
					
				}
			}
			
		}, function errorCallback(response) {
			console.log(response.status);
			
		});
		
	};
	
	$scope.$watch('brightness',function(oldVal,newVal)
	{
		console.log('brightness', $scope.brightness);
	});
	$scope.init();
	$scope.brightness = 100;
	$scope.visible=true;
	
	
	
	//$scope.update = 
	
	$scope.refresh = function()
	{
		$scope.updateLights();
	};
	$scope.refresh();

	
	$interval(function(){
		$scope.refresh();
		
	},500);

});
