
angular.module('gui.tado', []).controller('TadoCtrl', function OverviewCtrl($scope, $interval, $timeout,$rootScope,$http) {
	
	$scope.url_prefix = tado_url_prefix;
	$scope.home_id = tado_home_id;
	$scope.zone_id = tado_zone_id;

    $scope.init = function() {
        console.log('start TadoCtrl');
        
        console.log(3,round5(3));
        console.log(7,round5(7));
        console.log(97,round5(97));

	};

	$scope.heaterTemp = "--"
	$scope.heaterSollTemp = "--"
	$scope.tadoMode = "--"
    $scope.overlayType = "--"
    $scope.heatingPower = null;
    $scope.powerImg = 0;
    $scope.bgStyle = {'background-color':'#818181'};
    $scope.autoBtnStyle = {};
    // blau: 5079b1
    // orange: e9a020
    // grau: 

	$scope.init();
	
	$scope.refreshTado = function()
	{
        if ($scope.savedTemp) return;
        $http({
			method : 'GET',
			url : $scope.url_prefix+'?t=zonestate&id='+$scope.home_id+'&zoneid='+$scope.zone_id
		}).then(function successCallback(response) {
            // console.log('refreshTado', response);
            if ($scope.savedTemp) return;
			// console.log(response.data.sensorDataPoints.insideTemperature.celsius);
			$scope.heaterTemp = response.data.sensorDataPoints.insideTemperature.celsius;
            $scope.heaterSollTemp = response.data.setting.temperature != null ? response.data.setting.temperature.celsius : 0;
            if ($scope.heaterSollTemp <= 18)
            {
                $scope.bgStyle = {'background-color':'#7392c0'};
            } else {
                $scope.bgStyle = {'background-color':'#e9a020'};
            }
            
            // overlayMode "MANUAL"
            $scope.overlayType = response.data.overlayType;
            if ($scope.overlayType == 'MANUAL')
            {
                $scope.autoBtnStyle = {};
            } else {
                $scope.autoBtnStyle = {'background-color': 'black',
                    'color': 'white'};

            }

            // tadoMode "HOME", "AWAY"
            $scope.tadoMode = response.data.tadoMode;

            // heating Power PErcent
            $scope.heatingPower = response.data.activityDataPoints.heatingPower.percentage; 
            $scope.powerImg = round5($scope.heatingPower);        


		}, function errorCallback(response) {
			console.log(response.status);
			
		});
	};
    $scope.refreshTado();
	$interval(function(){
		$scope.refreshTado();
		
	},10000);

    $scope.savedTemp = null;
    $scope.timer = null;
    $scope.setTemp = function(v)
    {
        console.log("setTemp", v);
        if ($scope.savedTemp == null)
        {
            $scope.savedTemp = $scope.heaterSollTemp;
        }
        $scope.heaterSollTemp += v;
        if ($scope.heaterSollTemp > 25) $scope.heaterSollTemp = 25; 
        if ($scope.heaterSollTemp < 5) $scope.heaterSollTemp = 5; 
        $timeout.cancel($scope.timer);
        $scope.timer = $timeout($scope.setTempFinish,1000);

    }

    $scope.setTempFinish = function()
    {
        console.log('setTempFinish', $scope.savedTemp, $scope.heaterSollTemp);
        if ($scope.savedTemp != $scope.heaterSollTemp)
        {
            console.log('Neue Temp setzen', $scope.heaterSollTemp);
            $scope.setTempOfHeater($scope.heaterSollTemp);
        }
        $scope.savedTemp = null;
    }

	$scope.setTempOfHeater = function(t)
	{
		console.log(t);
		$http({
			method : 'GET',
			url : $scope.url_prefix+'?t=setTemp&id='+$scope.home_id+'&zoneid='+$scope.zone_id+'&temperature='+t
		}).then(function successCallback(response) {
			console.log('Success', response);
			$scope.refreshTado();
		}, function errorCallback(response) {
			console.log(response.status);
			
		});

	}

	$scope.setTempAuto = function()
	{
		$http({
			method : 'GET',
			url : $scope.url_prefix+'?t=removeTemp&id='+$scope.home_id+'&zoneid='+$scope.zone_id
		}).then(function successCallback(response) {
			// console.log('Success', response);
			$scope.refreshTado();
		}, function errorCallback(response) {
			console.log(response.status);
			
		});

	}

	

});
