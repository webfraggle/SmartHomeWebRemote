
angular.module('gui.tunaknob', []).controller('TunaKnobCtrl', function TunaKnobCtrl($scope, $rootScope) {
	
    $scope.posX = 0;
    $scope.posY = 0;
    $scope.centerPointX = 168;
    $scope.centerPointY = 168;
    $scope.angle = null;
    $scope.counter = 0;
    $scope.lastAngle = null;
    $scope.isActive = false;

    $scope.init = function() {
    console.log('start TunaKnobs');
    
    };
    $scope.init();
    
    $scope.touchStart = function()
    {
        $scope.reset();
        $scope.isActive = true;
        if (!event.targetTouches.length) return;
        touch = event.targetTouches[0];
        // console.log(touch);
        $scope.posX = touch.clientX - touch.target.offsetLeft;
        $scope.posY = touch.clientY - touch.target.offsetTop;

        $scope.lastAngle = Math.atan2($scope.posY - $scope.centerPointY, $scope.posX - $scope.centerPointX)  / Math.PI;
        // $rootScope.$broadcast('tuna-rotation-start', { 
        // });

    }
    
    $scope.touchEnd = function()
    {
        $scope.reset();
        $scope.isActive = false;
        // $rootScope.$broadcast('tuna-rotation-end', { 
        // });
    } 

    $scope.reset = function()
    {
        $scope.lastAngle = null;
        $scope.counter = 0;

    }

    $scope.touchMove = function()
    {
        // console.log('move');
        if (!event.targetTouches.length) return;
        touch = event.targetTouches[0];
        // console.log(touch);
        $scope.posX = touch.clientX - touch.target.offsetLeft;
        $scope.posY = touch.clientY - touch.target.offsetTop;

        $scope.angle = Math.atan2($scope.posY - $scope.centerPointY, $scope.posX - $scope.centerPointX)  / Math.PI;
        if ($scope.lastAngle != null)
        {
            var dif = null; 
            if ($scope.lastAngle < -0.5   && $scope.angle > 0.5)
            {
                dif = (1 +  $scope.lastAngle) +  (1 - $scope.angle);
                // console.log("Yo 1", $scope.lastAngle, $scope.angle, dif);
            } 
            else if ($scope.lastAngle > 0.5 && $scope.angle < -0.5)
            {
                dif = -1 *((1 -  $scope.lastAngle) +  (1 + $scope.angle));
                // console.log("Yo 2", $scope.lastAngle, $scope.angle, dif);
            } 
            else if ($scope.lastAngle > 0.0 && $scope.angle < -0.0)
            {
                dif = $scope.lastAngle +  (-1 * $scope.angle);
                // console.log("Yo 3", $scope.lastAngle, $scope.angle, dif);
            }
            else if ($scope.lastAngle < 0.0 && $scope.angle > -0.0)
            {
                dif = $scope.lastAngle +  (-1 * $scope.angle);
                // console.log("Yo 4", $scope.lastAngle, $scope.angle, dif);
            }
            else {

                dif = $scope.lastAngle - $scope.angle;
            }
            
            // console.log($scope.lastAngle, $scope.angle, dif);
            $scope.counter -= dif;
            console.log($scope.counter);
            

        }
        // $rootScope.$broadcast('tuna-rotation-change', { 
        //     relativeDistanceCounter: $scope.counter,
        //     absoluteAngle: ($scope.angle * (180 / Math.PI) * Math.PI)+180
        // });

        $scope.lastAngle = $scope.angle;
    }

});
