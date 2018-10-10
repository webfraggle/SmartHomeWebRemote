
angular.module('gui.overview', []).controller('OverviewCtrl', function OverviewCtrl($scope, $interval, $timeout,$rootScope,$http, hueService) {
	
    $scope.init = function() {
		console.log('start OverviewCtrl');

	};

	$scope.reload = function()
	{
		console.log('rel1');
		$rootScope.reloadPage();
	}
	// $scope.insideTemp = "--"
	// $scope.outsideTemp = "--"
	// $scope.heaterTemp = "--"
	// $scope.heaterSollTemp = "--"

	// $scope.tempsToSet = [14,15,16,17,18,19,20,21,22,23,24,25];
	$scope.briToSet = [50,75,87,100];
	$scope.init();

	$scope.setDeckenlampe = function(v)
	{
		$scope.setMultilights([3,5,7],v);
	}

	$scope.setSchlummerlampe = function(v)
	{
		$scope.setMultilights([1,2],v);
	}

	$scope.allesAus = function()
	{
		$scope.setMultilights([1,2,3,4,5,7],false);
	}
	$scope.setMultilights = function(lights,v)
	{
		if (v===true || v===false)
		{
			for (i=0;i<lights.length;i++)
			{
				hueService.switchLight(lights[i],v);
			}
			return;
		}
		for (i=0;i<lights.length;i++)
		{
			hueService.setBrightness(lights[i],v/100);
		}

	}

});
