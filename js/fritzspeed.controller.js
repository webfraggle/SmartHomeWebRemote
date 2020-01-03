
angular.module('gui.fritzspeed', []).controller('FritzSpeedCtrl', function FritzSpeedCtrl($scope, $interval, $http) {
	
    $scope.downloadMax = -1;
    $scope.uploadMax = -1;


    $scope.init = function() {
    console.log('start FritzSpeedCtrl');
    
    };
    $scope.init();
    
    
    $scope.refresh = function()
    {
        var factor = 1/8/1024
        $http({
			method : 'GET',
			url : 'http://orangepizeroplus/fritzbox/getCurrentSpeeds.php',
		}).then(function successCallback(response) {
			console.log('FritzSpeed',response);
			$scope.downloadMax = response.data.ds_bps_max*factor;
			$scope.uploadMax = response.data.us_bps_max*factor;
			
            
		}, function errorCallback(response) {
			console.log('FritzSpeed Error',response.status);
			
		});
    };
    $scope.refresh();
    
    
    $interval(function(){
		$scope.refresh();
		
    },3*1000);



});
