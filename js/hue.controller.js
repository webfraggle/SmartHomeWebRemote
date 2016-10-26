angular.module('gui.hue', []).controller('HueCtrl', function HueCtrl($scope, $interval, $timeout,$rootScope,$http) {
	
	$scope.ip = '192.168.178.54';
	$scope.key = '87wTw9H651KevYIWhQl2cw7K8KioqN4eLGe0N1Fv';
	$scope.url = 'http://'+$scope.ip+'/api/'+$scope.key+'/';
	$scope.lights = [];
	
	$scope.briSliderOptions = {
		    floor: 0,
		    ceil: 254,
		    vertical: true
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
			console.log(response.data);
			// for (var i=0; i < response.data.length; i++) {
			for (var lightNr in response.data)
			{
				var t = response.data[lightNr];
				t.options = angular.copy($scope.briSliderOptions);
				t.options.id = $scope.lights.length;
				t.options.onChange = $scope.handleChange;
			  $scope.lights.push(t);
			};
			console.log($scope.lights);
		}, function errorCallback(response) {
			console.log(response.status);
			
		});
	};
	
	$scope.handleChange = function(e)
	{
		console.log($scope.lights[e]);
		
		$http({
			method : 'PUT',
			url : $scope.url+'lights/'+(e+1)+'/state',
			data : {"on": true, "bri":$scope.lights[e].state.bri}
		}).then(function successCallback(response) {
			console.log(response.data);
			
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
	};
	$scope.refresh();

	
	$interval(function(){
		$scope.refresh();
		
	},1000);

});
