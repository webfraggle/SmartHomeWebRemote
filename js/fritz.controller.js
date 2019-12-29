
angular.module('gui.fritz', []).controller('FritzCtrl', function FritzCtrl($scope, $interval, $timeout) {
    
   $scope.visible = false;
   $scope.sid = '';
//    $scope.imageSrc = 'http://raspberrypi2/fritzbox/getCurrentSpeedsCircleSVG.php?v=';
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
        // $scope.imageSrc = 'http://raspberrypi2/fritzbox/getCurrentSpeedsCircleSVG.php?v='+Math.random();
        $scope.imageSrc = 'http://orangepizeroplus/fritzbox/getCurrentSpeedsCircleSVG.php?v='+Math.random();
    }

    $interval($scope.refresh, 5000);
    $scope.refresh();

});
