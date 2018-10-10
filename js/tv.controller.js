
angular.module('gui.tv', []).controller('TvCtrl', function TvCtrl($scope, $interval, $timeout,$rootScope,$http, lgService) {
    
   $scope.lgService = lgService;
   $scope.visible = false;
    $scope.init = function() {
		console.log('start TVCtrl');
        lgService.start();
    };
    $scope.init();

    $scope.toggleVisibility = function()
    {
        $scope.visible = !$scope.visible;
    }
    $scope.swipe = function(direction)
    {
        console.log('swipe', direction);
    }
    $scope.volumeUp = function()
    {
        lgService.volumeUp();
    }

    $scope.onChange = function()
    {

    }

    $scope.refresh = function()
    {
        $scope.lgService.getForegroundApp();
    }
    $scope.refreshApps = function()
    {
        $scope.lgService.updateApps();
    }
    $interval($scope.refreshApps, 60000);
    $scope.lgService.updateApps();
    $interval($scope.refresh, 2000);
    $scope.refresh();

});
