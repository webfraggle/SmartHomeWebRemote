
angular.module('gui.lights', []).controller('LightsCtrl', function LightsCtrl($scope, $interval, $timeout,$rootScope, hueService) {
    
    $scope.currentCenterLight = 1;
    $scope.lampTemplate = {bri:0,lightIds:[],on:false,title:'',
    colormode:'',
    featureBri:true,
    featureCt:false,
    featureHue:false,
    cssHue:{'background-color':'#000'},
    cssBri:{'background-color':'hsl(0,0%,100%)'},
    cssCt:{'background-color':'#000'}
};

    $scope.decke = angular.copy($scope.lampTemplate);
    $scope.decke.lightIds = [18];
    $scope.decke.title = 'Deckenlampe';

    $scope.fernseh = angular.copy($scope.lampTemplate);
    $scope.fernseh.lightIds = [1,2];
    $scope.fernseh.title = 'Fernsehlampe';

    $scope.ambiente = angular.copy($scope.lampTemplate);
    $scope.ambiente.lightIds = [9];
    $scope.ambiente.title = 'Ambiente';

    $scope.blume = angular.copy($scope.lampTemplate);
    $scope.blume.lightIds = [13,14,15,16];
    $scope.blume.title = 'Blumen';

    // $scope.go = angular.copy($scope.lampTemplate);
    // $scope.go.lightIds = [4];
    // $scope.go.title = 'GO';

    // $scope.ck = angular.copy($scope.lampTemplate);
    // $scope.ck.lightIds = [8];
    // $scope.ck.title = 'Christophs Lampe';

    $scope.lights = [$scope.decke, $scope.fernseh, $scope.ambiente, $scope.blume];
    $scope.timer = null;
    $scope.timeout = 4000;
    $scope.enabled = true;

    $scope.ctGradient = [
        '#ffbb6c',
        '#febd70',
        '#fcbe75',
        '#fabf7b',
        '#f8c182',
        '#f5c38a',
        '#f2c492',
        '#f0c69b',
        '#edc8a3',
        '#eacaac',
        '#e6ccb5',
        '#e3cebf',
        '#e1d1c8',
        '#ded2d0',
        '#dad4d9',
        '#d8d6e1',
        '#d5d8e8',
        '#d3daef',
        '#d2dbf5',
        '#d0dcfb'
    ];
    $scope.init = function() {
		console.log('start LightsCtrl');

    };

    $scope.update = function()
    {
        // console.log('HUE Update');
        hueService.update();
    }
    $scope.delayedUpdate = function()
    {
        $timeout($scope.update,150);
    }
    $scope.update();
    $interval(function(){
        	$scope.update();
        },1000);
    $scope.handleChange = function()
    {
        // console.log(hueService.lights);

        for (var j=0;j<$scope.lights.length;j++)
        {
            var t = $scope.lights[j];
            var bri=0;
            var onCounter=0;
            for (var i=0;i<t.lightIds.length;i++)
            {
                var cLight = hueService.getLightById(t.lightIds[i]);
                // console.log(cLight);
                bri += cLight.state.on ? cLight.state.bri : 0; 
                onCounter += cLight.state.on ? 1 : 0;
                if (cLight.state.colormode)
                {
                    t.colormode = cLight.state.colormode;
                }
                if (cLight.state.ct)
                {
                    t.featureCt = true;
                    var factor = 1-((cLight.state.ct-153)/(500-153));
                    t.cssCt['background-color'] = $scope.ctGradient[Math.round($scope.ctGradient.length*factor)];
                    // console.log('CT',cLight.state.ct,$scope.ctGradient.length,factor,t.cssHue['background-color']);
                }
                if (cLight.state.hue != null)
                {
                    t.featureHue = true;
                    t.cssHue['background-color'] = hslToRgb(cLight.state.hue/65535,1,.5)
                }
            }
            // t.bri = bri == 0 ? 0 : round5((hueService.getNearestBriId(bri/t.lightIds.length)+1)/32*100);
            t.bri = bri == 0 ? 0 : Math.round(bri/t.lightIds.length/254*100);
            t.cssBri['background-color'] = 'hsl(0,0%,'+t.bri+'%)'
            t.on = onCounter != 0 ? true : false;
        }
       
    }
    hueService.onChange = $scope.handleChange;

    
    $scope.init();
    $scope.parameterVisible=false;
    $scope.touchTimer = null;
    $scope.lightTouchStart = function(light)
    {
        console.log('touchstart', light);
        $scope.touchTimer = $timeout($scope.handleLongPress.bind(null, light),500);
        
    }

    $scope.handleLongPress = function(light)
    {
        console.log('longPRess',light);
        $scope.showBrightness(light);
        $timeout.cancel($scope.touchTimer);
        $scope.touchTimer = null;
    }
    $scope.lightTouchEnd = function(light)
    {
        console.log('touchend', light, $scope.touchTimer);
        if ($scope.touchTimer != null)
        {
            $scope.toggleLight(light);
        }
        $timeout.cancel($scope.touchTimer);
        $scope.touchTimer = null;
    }
    $scope.lightClicked = function(e,light)
    {
        var eClass = e.target.getAttribute('class') ? e.target.getAttribute('class') : '';
        if (eClass.indexOf('circle') !== -1)
        {
            $scope.showBrightness(light);
            return;
        }
        $scope.toggleLight(light);
    }
    $scope.toggleLight = function(light)
    {
        v = !light.on;
        for (i=0;i<light.lightIds.length;i++)
        {
            hueService.switchLight(light.lightIds[i],v);
        }
        $scope.delayedUpdate();
    }
    $scope.switchLight = function(light,what)
    {
        for (i=0;i<light.lightIds.length;i++)
        {
            hueService.switchLight(light.lightIds[i],what);
        }
        $scope.delayedUpdate();
    }
    $scope.lastSetTime = Date.now();
    
    $scope.currentLight = null;
    $scope.showBrightness = function(light)
    {
        $timeout.cancel($scope.timer);
        $scope.timer = $timeout($scope.hideBrightness,$scope.timeout);
        $scope.parameterVisible = true;
        $scope.currentLight = light;

    }

    $scope.hideBrightness = function(light)
    {
        $scope.parameterVisible = false;
        $scope.currentLight = null;
    }
    $scope.touchMove = function(e)
    {
        var von = 100;
        var bis = 620;
        $timeout.cancel($scope.timer);
        $scope.timer = $timeout($scope.hideBrightness,$scope.timeout);

        var y = event.touches[0].clientY;
        // console.log(y);
        if (y < von) y = von;
        if (y > bis) y = bis;
        var factor = (y-von)/(bis-von);
        factor = 1-factor;
        // console.log('move', y, factor);

        var eClass = event.target.getAttribute('class');
        if (eClass.indexOf('brightness')!==-1)
        {
            $scope.setBrightness($scope.currentLight,(factor)*254);
        }

        if (eClass.indexOf('temperature')!==-1)
        {
            var ct= 153+(factor*(500-153));
            console.log();
            $scope.setColorTemperature($scope.currentLight,ct);
        }

        if (eClass.indexOf('color')!==-1)
        {
            var hue= 0+(factor*(65535));
            console.log('hue',hue);
            $scope.setHue($scope.currentLight,hue);
        }
        
    }

    $scope.setColorTemperature = function(light,temp)
    {
        if (!light) return;
        if (Date.now()- $scope.lastSetTime < 200) return;
        $scope.lastSetTime = Date.now();
        //v = !light.on;
        for (i=0;i<light.lightIds.length;i++)
        {
            hueService.setColorTemperature(light.lightIds[i],Math.round(temp));
        }
        $scope.delayedUpdate();
    }

    $scope.setHue = function(light,hue)
    {
        if (!light) return;
        if (Date.now()- $scope.lastSetTime < 200) return;
        $scope.lastSetTime = Date.now();
        //v = !light.on;
        for (i=0;i<light.lightIds.length;i++)
        {
            hueService.setHue(light.lightIds[i],Math.round(hue));
        }
        $scope.delayedUpdate();
    }

    $scope.setBrightness = function(light,bri)
    {
        if (!light) return;
        if (Date.now()- $scope.lastSetTime < 200) return;
        $scope.lastSetTime = Date.now();
        //v = !light.on;
        for (i=0;i<light.lightIds.length;i++)
        {
            hueService.setBrightness(light.lightIds[i],Math.round(bri));
        }
        $scope.delayedUpdate();
    }


	$scope.allesAus = function()
	{
		$scope.setMultilights([1,2,3,4,5,7,9],false);
	}

    $scope.goLeft = function()
    {
        if ($scope.currentCenterLight < $scope.lights.length)
        {
            $scope.currentCenterLight ++;
        }
    }
    $scope.goRight = function()
    {
        if ($scope.currentCenterLight > 1)
        {
            $scope.currentCenterLight --;
        }
    }

    // Tuna Knob Events
    $rootScope.$on('tuna-rotation-start', function(event, args) {
        $scope.currentLight = $scope.lights[$scope.currentCenterLight-1];
        $scope.tunaStartBri = $scope.currentLight.bri*254/100;
        $scope.tunaCurrentBri = $scope.tunaStartBri+0;
        console.log('tuna-start', $scope.tunaStartBri, $scope.tunaCurrentBri, $scope.lights);
    });
    $rootScope.$on('tuna-rotation-end', function(event, args) {
        $scope.currentLight = null;
        console.log('tuna-end', $scope.lights);
    });
    $rootScope.$on('tuna-rotation-change', function(event, args) {
        // console.log(args);
        $scope.tunaCurrentBri = $scope.tunaStartBri+args.relativeDistanceCounter*200;
        // console.log('tuna-move',$scope.tunaStartBri,$scope.tunaCurrentBri);
        if ($scope.tunaCurrentBri <= 0){
            $scope.tunaCurrentBri = 0;
            $scope.switchLight($scope.currentLight, false);
            return;
        } 
        if ($scope.tunaCurrentBri > 255) $scope.tunaCurrentBri = 255;
        $scope.setBrightness($scope.currentLight,$scope.tunaCurrentBri);
    });

    $scope.onKeyDown = function(keycodes)
    {
        // console.log(keycodes);
        keycodes.preventDefault();

        switch (keycodes.key)
		{
            case "ArrowRight":
                $scope.goLeft();
				return;
            break;
            case "ArrowLeft":
                $scope.goRight();
				return;
            break;
        }
        
        console.log(keycodes.key);
            $scope.currentLight = $scope.lights[$scope.currentCenterLight-1];
            $scope.tunaStartBri = $scope.currentLight.bri*254/100;
            $scope.tunaCurrentBri = $scope.tunaStartBri+0;

        stepSize = 36;
        switch (keycodes.key)
		{
            case "ArrowUp":
				$scope.tunaCurrentBri = $scope.tunaStartBri+stepSize;
			break;
			case "ArrowDown":
				$scope.tunaCurrentBri = $scope.tunaStartBri-stepSize;
			break;
        }
        
        // console.log('tuna-move',$scope.tunaStartBri,$scope.tunaCurrentBri);
        if ($scope.tunaCurrentBri <= 0){
            $scope.tunaCurrentBri = 0;
            $scope.switchLight($scope.currentLight, false);
            $scope.currentLight = null;
            return;
        } 
        if ($scope.tunaCurrentBri > 255) $scope.tunaCurrentBri = 255;
        $scope.setBrightness($scope.currentLight,$scope.tunaCurrentBri);
        $scope.currentLight = null;
    }
    if (window.addEventListener) 
        window.addEventListener("keydown", $scope.onKeyDown, false);
    else if (window.attachEvent) 
        window.attachEvent("onkeydown", $scope.onKeyDown);
    $scope.setMultilights = function(lights,v)
	{
		if (v===true || v===false)
		{
			for (i=0;i<lights.length;i++)
			{
				hueService.switchLight(lights[i],v);
			}
			return;
		}
	}

});
