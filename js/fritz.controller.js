
angular.module('gui.fritz', []).controller('FritzCtrl', function FritzCtrl($scope, $interval, $timeout,$rootScope,$http, lgService) {
    
   $scope.visible = false;
   $scope.imageSrc = 'http://raspberrypi/fritzbox/getCurrentSpeedsCircleSVG.php?v=';
    $scope.init = function() {
		console.log('start FritzCtrl');
    };
    $scope.init();

    $scope.toggleVisibility = function()
    {
        $scope.visible = !$scope.visible;
    }
    
    $scope.refresh = function()
    {
        console.log('refresh Fritz');
        $scope.imageSrc = 'http://raspberrypi/fritzbox/getCurrentSpeedsCircleSVG.php?v='+Math.random();
    }

    $interval($scope.refresh, 3000);
    $scope.refresh();

});
