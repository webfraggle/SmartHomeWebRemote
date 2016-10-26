var myApp = angular.module('huedisplay', ['gui.hue', 'rzModule'
])

.controller('AppCtrl', function AppCtrl($scope, $http, $timeout, $rootScope, $interval, $sce) {


	$scope.showsettings = false;
	$rootScope.disabled = [];

	$scope.toggleVisibility = function()
	{
		
	};

});
