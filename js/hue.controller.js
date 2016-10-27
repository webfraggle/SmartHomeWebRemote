angular.module('gui.hue', []).controller('HueCtrl', function HueCtrl($scope, $interval, $timeout,$rootScope,$http) {
	
	$scope.ip = '192.168.178.54';
	$scope.key = '87wTw9H651KevYIWhQl2cw7K8KioqN4eLGe0N1Fv';
	$scope.url = 'http://'+$scope.ip+'/api/'+$scope.key+'/';
	$scope.lights = [];

	$scope.ctLightType = 'Color temperature light';
	$scope.colorLightType = 'Extended color light';
	
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
