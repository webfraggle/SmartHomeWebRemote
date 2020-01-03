
angular.module('gui.time', []).controller('TimeCtrl', function TimeCtrl($scope, $interval) {
	
    $scope.time = "--Time--";

    $scope.init = function() {
    console.log('start TimeCtrl');
    
    };
    $scope.init();
    
    $scope.refresh = function()
    {
        var t = new Date().getTime();
        $scope.time = t;
    };
    $scope.refresh();
    
    
    $interval(function(){
		$scope.refresh();
		
	},10000);

});
