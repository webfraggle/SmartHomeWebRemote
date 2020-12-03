var myApp = angular.module('huedisplay', [
	// 'gui.hue',
	// 'gui.overview',
	// 'uiSwitch',
	'ngTouch',
    'ngAnimate',
	// 'pr.longpress',
	'gui.time',
	'gui.tunaknob',
	'gui.netatmo',
	'gui.lights',
	// 'gui.tv',
	'gui.fritz',
	'gui.tado',
	'gui.tempchart',
	'gui.launcher',
	'gui.fritzspeed'
	// 'gui.news'

	// 'rzModule'
]).directive('myTouchstart', [function() {
	return function(scope, element, attr) {

		element.on('touchstart', function(event) {
			scope.$apply(function() { 
				scope.$eval(attr.myTouchstart); 
			});
		});
	};
}]).directive('myTouchend', [function() {
	return function(scope, element, attr) {

		element.on('touchend', function(event) {
			scope.$apply(function() { 
				scope.$eval(attr.myTouchend); 
			});
		});
	};
}])
.directive('myTouchmove', function() {
    return {
        restrict    : 'A',
        link        : function( $scope, $element, $attr ) {
            $element.on('touchmove', function( event ) {
                $scope.$apply(function() {
                    $scope.$eval( $attr.myTouchmove, event );
                });
            });
        }
    }
})
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
	
	.factory('DataSource', ['$http',function($http){
		return {
			get: function(file,callback,transform){
				$http.get( file, {transformResponse:transform} ).

						success(function(data, status) {
							console.log("Request succeeded", data);
							callback(data);
						}).error(function(data, status) {
							console.log("Request failed " + status);
						});

			}
		};
	}])
.controller('AppCtrl', function AppCtrl($scope, $rootScope, $element, $timeout) {


	$scope.timer = null;
	$scope.showsettings = false;
	$rootScope.disabled = [];
	$scope.state = 3;
	$scope.subindex = 0;
	$scope.substate = 0;
	$scope.states = [
		[{time:10}],
		[{time:10}],
		[{time:10}],
		[{time:5}]
	];
	// $scope.states = [
	// 	[{time:2}],
	// 	[{time:2}],
	// 	[{time:2}]
	// ];
	$scope.auto = true;

	//$scope.state = 'overview';
	// $scope.bodyStyle = {'transform':'scale(1.11)'};
	// $scope.bodyStyle = {'transform':'scale('+(1280/800)+')'};

	$scope.resize = function()
	{
		console.log('resizing', window.screen.availWidth, window.screen.availHeight);
		if (window.screen.availWidth == 600)
		{
			return;
		}
		// console.log(window);
		if (window.screen.availWidth < 600 || window.screen.availHeight < 1024)
		{
			scaleX = window.screen.availWidth/600;
			scaleY = window.screen.availHeight/1024;
			scale = scaleX < scaleY ? scaleX : scaleY;
			$scope.bodyStyle.transform = 'scale('+scale+')';
			console.log("scaleX/Y, scale", scaleX, scaleY, scale);
		}
		
	}
	$scope.resize();
	window.addEventListener("resize",$scope.resize);
	window.addEventListener("orientationchange",$scope.resize)
	$scope.toggle = function()
    {
		if ($scope.timer != null)
		{
			$timeout.cancel($scope.timer);
		}
		//console.log($scope.states);
		// console.log($scope.states[$scope.state]);
		console.log('from state:', $scope.state);
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
		console.log('to state',$scope.state, 'substate:',$scope.substate, 'subindex:',$scope.subindex);
		$scope.timer = $timeout(function(){
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
		// console.log(key.key);
		// switch (key.key)
		// {
		// 	case "ArrowRight":
		// 		$scope.toggle();
		// 		$scope.auto = false;
		// 	break;
		// }
	}
	console.log($scope.states, $scope.state, $scope.subindex);
	$scope.timer = $timeout(function(){
			if ($scope.auto)
			{
				$scope.toggle();
			}
	},$scope.states[$scope.state][$scope.subindex].time*1000);



});
