
angular.module('gui.hue', []).controller('HueCtrl', function HueCtrl($scope, $interval, $timeout,$rootScope,$http, hueService) {
	
	$scope.lights = [];
	$scope.rooms = hueService.rooms;




	console.log('SERVICE', hueService);


	$scope.briSliderOptions = {
		    floor: 0,
		    ceil: 254,
				vertical: true,
				onlyBindHandles: true,
				keyboardSupport:false,
				noSwitching: true,
				hideLimitLabels: true,
				hidePointerLabels: true
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

		$scope.update = function()
    {
        // console.log('HUE Update');
        hueService.update();
    }
    $scope.delayedUpdate = function()
    {
        $timeout($scope.update,150);
    }
    $scope.update();
    $interval(function(){
        	$scope.update();
        },1000);
	$scope.init = function() {
		console.log('start HueCtrl');
		

	};

	$scope.handleChange = function()
	{
			// console.log(hueService.lights);
			//$scope.lights = hueService.lights;
			// init
			if ($scope.lights.length < 1)
			{

				for (var lightNr in hueService.lights)
				{
					t = angular.copy(hueService.lights[lightNr]);
					//t = {};
					t.options = angular.copy($scope.briSliderOptions);
					t.busy = false;
					t.options.onChange = $scope.setBrightness;
					t.options.onStart = $scope.onStart;
					t.options.onEnd = $scope.onEnd;
					t.options.id = t.id;
					$scope.lights.push(t);
				}
			}

			for (var lightNr in hueService.lights)
			{
				remoteLight = hueService.lights[lightNr];
				var localLight = $scope.getLightById(remoteLight.id);
				if (!localLight.busy)
				{
					localLight.state.bri = remoteLight.state.bri;
				}
				localLight.state.on = remoteLight.state.on;
			}

			$timeout(function(){});
	}

	hueService.onChange = $scope.handleChange;

	$scope.handleChangeGroups = function()
	{
			console.log('Groups changed');
			console.log(hueService.groups)
			console.log(hueService.rooms);
			$scope.rooms = hueService.rooms;
			$timeout(function(){});
	}

	hueService.onChangeGroups = $scope.handleChangeGroups;
	hueService.updateGroups();
	$scope.onStart = function(id)
	{
		// console.log('onStart id:', id);
		$scope.getLightById(id).busy = true;
	}
	$scope.onEnd = function(id)
	{
		// console.log('onEnd id:', id);
		localLight = $scope.getLightById(id);
		hueService.setBrightness(localLight.id,localLight.state.bri);
		if (localLight.state.bri <=0)
		{
			hueService.switchLight(localLight.id, false);
		}
		localLight.busy = false;
	}

	$scope.setBrightness = function(id)
	{
		console.log('setBrightness id:', id);
		var localLight = $scope.getLightById(id);
		var remoteLight = hueService.getLightById(id);
		// console.log('remoteLight', remoteLight.busy);
		if (!remoteLight.busy)
		{
			hueService.setBrightness(localLight.id,localLight.state.bri);
		}
		if (localLight.state.bri <=0)
		{
			hueService.switchLight(localLight.id, false);
		}
	};

	$scope.toggleLight = function(id)
    {
			light = hueService.getLightById(id);
			console.log('toggle',id,light);	
				v = !light.state.on;
        hueService.switchLight(light.id,v);
        $scope.delayedUpdate();
    }

	$scope.getLightById = function(id)
	{
		id = ''+id;
		for(var i=0,j=$scope.lights.length; i<j; i++){
		  if ($scope.lights[i].id == id) return $scope.lights[i];
		  
		};
	};

	//--------
	
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
	
	$scope.setColorTemperature = function(id)
	{
		console.log('ct', id);
		var theLight = $scope.getLightById(id);
		if (theLight.busy) return;
		
		theLight.busy = true;
		var data =  { "ct":theLight.state.ct};
		if (theLight.state.colormode != 'ct')
		{
			data['colormode'] = 'ct';
		}
		$http({
			method : 'PUT',
			url : $scope.url+'lights/'+theLight.id+'/state',
			data : data
		}).then(function successCallback(response) {
			console.log(response.data);
			for (i in response.data)
			{
				if(response.data[i].success)
				{
					for (str in response.data[i].success)
					{
						
						console.log(str);
						var id = str.replace(/[^0-9\.]/g, '');
						console.log('resp id', id);
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
		console.log('hue id', id);
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

	// TODO: only when visible
	// $interval(function(){
	// 	$scope.refresh();
		
	// },500);

});
