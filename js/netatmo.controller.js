
angular.module('gui.netatmo', []).controller('NetatmoCtrl', function NetatmoCtrl($scope, $interval,$rootScope,$http) {

    $scope.init = function() {
		console.log('start NetatmoCtrl');

	};

	$scope.weatherIcon = '';
	$scope.forecast = [];

	$scope.reload = function()
	{
		console.log('rel1');
		$rootScope.reloadPage();
	}

	$scope.init();

	$scope.refreshNetatmo = function()
	{
		$http({
			method : 'GET',
			url : netatmo_get_url
		}).then(function successCallback(response) {
			console.log('Netatmo',response);
			// console.log(response.data.inside.Temperature);
			$scope.inside = response.data.inside;
			$scope.outside = response.data.outside;
		}, function errorCallback(response) {
			console.log(response.status);
			
		});
		$http({
			method : 'GET',
			url : 'https://api.openweathermap.org/data/2.5/weather?lat='+openweathermap_lat+'&units=metric&lon='+openweathermap_lon+'&APPID='+openweathermap_key
		}).then(function successCallback(response) {
			// console.log('OpenWeather',response);
			$scope.weatherIcon = 'owf-'+response.data.weather[0].id;
		}, function errorCallback(response) {
			console.log('OpenWeather Error',response.status);
			
		});
		$http({
			method : 'GET',
			url : 'https://api.openweathermap.org/data/2.5/forecast/daily?lat='+openweathermap_lat+'&units=metric&lon='+openweathermap_lon+'&APPID='+openweathermap_key
		}).then(function successCallback(response) {
			// console.log('OpenWeatherForecast',response);
			// $scope.weatherIcon = 'forecast-'+response.data.weather[0].id;
			$scope.forecast = response.data.list;
		}, function errorCallback(response) {
			console.log('OpenWeather Error',response.status);
			
		});
	};
	$scope.refreshNetatmo();

	$interval(function(){
		$scope.refreshNetatmo();
		
	},60000);


});
