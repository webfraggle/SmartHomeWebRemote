
angular.module('gui.tempchart', []).controller('TempChartCtrl', function FritzSpeedCtrl($scope, $interval, $http) {
	
    $scope.chartData = {
        // A labels array that can contain any sort of values
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        // Our series array that contains series objects or in this case series data arrays
        series: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
      };
    $scope.chartOptions = {
        // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
        high: 35,
        // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
        low: -12,
        // divisor: 4,
        // ticks: [1, 10, 20, 30],
        showPoint: true,
        // Can be set to true or false. If set to true, the scale will be generated with whole numbers only.
        onlyInteger: true,
        // The reference value can be used to make sure that this value will always be on the chart. This is especially useful on bipolar charts where the bipolar center always needs to be part of the chart.
        referenceValue: 50,
        width: 600,
        height: 270,
        axisX: {
            // We can disable the grid for this axis
            showGrid: true,
            // and also don't show the label
            showLabel: true
          },
      };

    $scope.factor = 1*8/1000/1000;
    $scope.chart = null;


    $scope.init = function() {
    console.log('start TempChartCtrl');
      $scope.chart = new Chartist.Line('#chart-temp', $scope.chartData, $scope.chartOptions, true);
      
    };
    $scope.init();
    
    
    $scope.refresh = function()
    {
        
        $http({
			method : 'GET',
			url : 'https://www.ketzler.de/sh/netatmo_get_values/getHistory.php',
		}).then(function successCallback(response) {
            // console.log('TempChart',response);
            var d = response.data;
            if (!d) return;

            // begin time
            dateObj = new Date(d.Innen.beg_time * 1000); 
            utcString = dateObj.toUTCString();
            beg_time_local = new Date(utcString);
            step = d.Innen.step_time *1000;

            // console.log(beg_time_local.toString(), step, (beg_time_local*1));

            $scope.chartData.series[1] = d['Innen']['Temperature'];
            $scope.chartData.series[0] = d['Außen']['Temperature'];
            $scope.chartData.series[2] = [];
            $scope.chartData.labels = [];
            cTime = beg_time_local.value;
            for(var i = 0; i < d['Außen']['Temperature'].length; i++) {
                $scope.chartData.series[2].push(0);
                vTime = new Date(beg_time_local*1+i*step);
                m = vTime.getMinutes();
                h = vTime.getHours();
                // console.log(1, vTime, h, m);
                if (m == 0 && (h == 6 || h == 12 || h == 18 || h == 0 || h == 9 || h == 21 || h == 3 || h == 15))
                {
                    $scope.chartData.labels.push(h+':00');
                } else {

                    $scope.chartData.labels.push('');
                }
            }

            // $scope.chartOptions.high = $scope.downloadMax;
            // $scope.chartData.series[0].reverse();
            // $scope.chartData.series[1].reverse();

            // Min Max
            $merge = $scope.chartData.series[0].concat($scope.chartData.series[1]);

            $scope.chartOptions.low = Math.min(...$merge);
            $scope.chartOptions.high = Math.max(...$merge);

            // console.log($scope.chartData);
            $scope.chart.update($scope.chartData, $scope.chartOptions, true);
            // console.log($scope.chart);
			
            
		}, function errorCallback(response) {
			console.log('TempCHart Error',response.status);
			
		});
    };
    $scope.refresh();
    
    
    $interval(function(){
		$scope.refresh();
		
    },30*60*1000);



});
