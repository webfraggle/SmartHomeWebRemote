var myApp = angular.module('huedisplay', [
	// 'gui.hue',
	// 'gui.overview',
	// 'uiSwitch',
	// 'ngTouch',
	// 'pr.longpress',
	'gui.time',
    'gui.netatmo',
    'ngAnimate'
	// 'gui.lights',
	// 'gui.tv',
	// 'gui.tado'

	// 'rzModule'
])
.filter('smallDecimal', function() {

	return function(input) {
		input = input || '';
		var t = input.split('.');
		if (t.length < 2){
			t[0] = '-';
			t[1] = '-';
		}
		var out = t[0]+'<span class="smallDecimal">.'+t[1]+'<span>';
		return out;
	  };
})
.filter('dayTranslate', function() {

	return function(input) {
		var out = input || '';
		out = out.replace('Sun','So');
		out = out.replace('Mon','Mo');
		out = out.replace('Tue','Di');
		out = out.replace('Wed','Mi');
		out = out.replace('Thu','Do');
		out = out.replace('Fri','Fr');
		out = out.replace('Sat','Sa');
		return out;
	  };
})
.filter('trust', ['$sce',function($sce) {
	return function(value, type) {
	  return $sce.trustAs(type || 'html', value);
	}
  }])
.controller('AppCtrl', function AppCtrl($scope, $rootScope, $element, $interval, $timeout) {


	$scope.showsettings = false;
	$rootScope.disabled = [];

    $scope.maxStates = 4;
	$scope.state = 0;
	$scope.subindex = 0;
	$scope.substate = 0;
	$scope.bodyStyle = {'transform':'scale(1)'};
	$scope.auto = true;

	$scope.states = [
		[{time:20},{time:10}],
		[{time:10},{time:10},{time:10}],
		[{time:10},{time:10},{time:10}],
		[{time:20}],
		[{time:5},{time:5},{time:5},{time:5},{time:5},{time:5},{time:5}]
	];

    $scope.toggle = function()
    {
		console.log($scope.states);
		console.log($scope.states[$scope.state]);
		$scope.subindex++;
		if ($scope.subindex >= $scope.states[$scope.state].length)
		{
			$scope.subindex = 0;
			$scope.state++;
			if ($scope.state >= $scope.states.length)
			{
				$scope.state = 0;
			}
		}
		$scope.substate = 0;
		if ($scope.state > 0)
		{

			for (let i = 0; i < $scope.state; i++) {
				$scope.substate += $scope.states[i].length;
				
			}
		}
		time = $scope.states[$scope.state][$scope.subindex].time;
		$scope.substate += $scope.subindex;
		console.log($scope.state, $scope.substate, $scope.subindex);
		$timeout(function(){
				if ($scope.auto)
				{
					$scope.toggle();
				}
		},time*1000);
		return;
		if ($scope.state < $scope.maxStates)
        {
            $scope.state++;

        } else {
            $scope.state = 0;
        }
    }

	$scope.handleKeyDown = function(key)
	{
		console.log(key.key);
		switch (key.key)
		{
			case "ArrowRight":
				$scope.toggle();
				$scope.auto = false;
			break;
		}
	}
	$timeout(function(){
		if ($scope.auto)
		{
			$scope.toggle();
		}
},$scope.states[$scope.state][$scope.subindex].time*1000);
	
	// $interval(function(){
	// 	if ($scope.auto)
	// 	{
	// 		$scope.toggle();
	// 	}
	// },10000);
});
