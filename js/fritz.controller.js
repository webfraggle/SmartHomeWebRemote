
angular.module('gui.fritz', []).controller('FritzCtrl', function FritzCtrl($scope, DataSource, $interval, $timeout,$rootScope,$http, lgService) {
    
   $scope.visible = false;
   $scope.sid = '';
   //$scope.imageSrc = 'http://raspberrypi/fritzbox/getCurrentSpeedsCircleSVG.php?v=';
   $scope.imageSrc = '';
    $scope.init = function() {
		console.log('start FritzCtrl');
    };
    $scope.init();

    xmlTransform = function(data) {
		console.log("transform data");
		var x2js = new X2JS();
        var json = x2js.xml_str2json(data);
        console.log(json);
		//return json.TimerStatus;
    };
    
    setData = function(data) {
        console.log("setdata", data);
            //$scope.dataSet = data;
        };

    $scope.toggleVisibility = function()
    {
        $scope.visible = !$scope.visible;
    }
    
    $scope.refresh = function()
    {
        console.log('refresh Fritz');
        //DataSource.get('http://fritz.box/login_sid.lua?sid='+$scope.sid,setData,xmlTransform);
        //$scope.imageSrc = 'http://raspberrypi/fritzbox/getCurrentSpeedsCircleSVG.php?v='+Math.random();
    }

    $timeout($scope.refresh, 3000);
    //$scope.refresh();

});
