angular.module('gui.hue', []).controller('HueCtrl', function HueCtrl($scope, $interval, $timeout,$rootScope,$http) {

	//$scope.url = "http://raspberrypi/netatmo/get.php";

	$scope.init = function() {
		console.log('start HueCtrl');
	};
	$scope.init();
	$scope.values = {};
	$scope.test = "hue";
	$scope.counter = 1;
	$scope.brightness = 100;
	$scope.visible=true;
	$scope.refresh = function()

	{
		$scope.counter++;
		// $http({
			// method : 'GET',
			// url : $scope.url
		// }).then(function successCallback(response) {
			// // this callback will be called asynchronously
			// // when the response is available
			// console.log(response.data);
			// $scope.values.inside = {};
			// $scope.values.inside.temp = response.data.inside.Temperature;
			// $scope.values.inside.temp_max = response.data.inside.max_temp;
			// $scope.values.inside.temp_min = response.data.inside.min_temp;
			// $scope.values.inside.pressure = Math.round(response.data.inside.Pressure);
			// $scope.values.inside.co2 = Math.round(response.data.inside.CO2);
			// $scope.values.inside.humidity = Math.round(response.data.inside.Humidity);
// 			
			// $scope.values.outside = {};
			// $scope.values.outside.temp = response.data.outside.Temperature;
			// $scope.values.outside.temp_max = response.data.outside.max_temp;
			// $scope.values.outside.temp_min = response.data.outside.min_temp;
			// $scope.values.outside.humidity = Math.round(response.data.outside.Humidity);
			// // $scope.picUrl = response.data;
		// }, function errorCallback(response) {
			// // called asynchronously if an error occurs
			// // or server returns response with an error status.
			// console.log(response.status);
// 			
		// });
	};
	$scope.refresh();

	
	$interval(function(){
		$scope.refresh();
		
	},1000);

});
