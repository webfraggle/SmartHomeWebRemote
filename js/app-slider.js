var myApp = angular.module('huedisplay', [
	'gui.hue',
	// 'gui.overview',
	// 'uiSwitch',
	'ngTouch',
	// 'pr.longpress',
	// 'gui.time',
	// 'gui.netatmo',
	// 'gui.lights',
	// 'gui.tv',
	// 'gui.fritz',
	// 'gui.tado',

	'rzModule'
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
.controller('AppCtrl', function AppCtrl($scope, $rootScope, $element) {


	$scope.showsettings = false;
	$rootScope.disabled = [];

	$scope.state = 'overview';
	// $scope.bodyStyle = {'transform':'scale(1)'};

	// $scope.resize = function()
	// {
	// 	console.log(window);
	// 	if (window.screen.availWidth < 480)
	// 	{
	// 		scale = window.screen.availWidth/480; 
	// 		$scope.bodyStyle.transform = 'scale('+scale+')';
	// 		console.log('resizing');
	// 		console.log($scope.bodyStyle);
	// 	}
	// }
	// $scope.resize();
	// $scope.toggleState = function(newState)
	// {
	// 	$scope.state = newState;
	// };

	// $scope.reloadPage = function()
	// {
	// 	console.log('Reload');
	// 	location.reload();
	// }
	// $scope.refresh = function()
	// {
	// 	$http({
	// 		method : 'GET',
	// 		url : 'tado_api/get.php?t=zonestate&id=130130&zoneid=1'
	// 	}).then(function successCallback(response) {
	// 		console.log(response);
	// 	}, function errorCallback(response) {
	// 		console.log(response.status);
			
	// 	});
	// };

	// $interval(function(){
	// 	$scope.refresh();
		
	// },500);
});
