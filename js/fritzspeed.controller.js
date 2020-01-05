
angular.module('gui.fritzspeed', []).controller('FritzSpeedCtrl', function FritzSpeedCtrl($scope, $interval, $http) {
	
    $scope.downloadMax = -1;
    $scope.uploadMax = -1;
    $scope.chartData = {
        // A labels array that can contain any sort of values
        // labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        // Our series array that contains series objects or in this case series data arrays
        series: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
      };
    $scope.chartOptions = {
        // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
        high: 100,
        // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
        low: 0,
        divisor: 4,
        ticks: [1, 10, 20, 30],
        showPoint: true,
        // Can be set to true or false. If set to true, the scale will be generated with whole numbers only.
        onlyInteger: true,
        // The reference value can be used to make sure that this value will always be on the chart. This is especially useful on bipolar charts where the bipolar center always needs to be part of the chart.
        referenceValue: 50,
        width: 600,
        height: 220,
        axisX: {
            // We can disable the grid for this axis
            showGrid: false,
            // and also don't show the label
            showLabel: false
          },
      };

    $scope.factor = 1*8/1000/1000;
    $scope.chart = null;


    $scope.init = function() {
    console.log('start FritzSpeedCtrl');
      $scope.chart = new Chartist.Line('#chart-dslspeed', $scope.chartData, $scope.chartOptions, true);
      
    };
    $scope.init();
    
    
    $scope.refresh = function()
    {
        
        $http({
			method : 'GET',
			url : 'http://orangepizeroplus/fritzbox/getCurrentSpeeds.php',
		}).then(function successCallback(response) {
            // console.log('FritzSpeed',response);
            var d = response.data[0];
            if (!d) return;
			$scope.downloadMax = d.ds_bps_max*$scope.factor;
            $scope.uploadMax = d.us_bps_max*$scope.factor;
            $scope.chartData.series[0] = [];
            $scope.chartData.series[1] = [];
            // $scope.chartOptions.high = $scope.downloadMax;
            d.ds_bps_curr.forEach(v => {
                $scope.chartData.series[1].push(v*$scope.factor);
            });
            d.us_default_bps_curr.forEach(v => {
                $scope.chartData.series[0].push(v*$scope.factor);
            });
            $scope.chartData.series[0].reverse();
            $scope.chartData.series[1].reverse();
            $scope.chart.update($scope.chartData, $scope.chartOptions, true);
            // console.log($scope.chart);
			
            
		}, function errorCallback(response) {
			console.log('FritzSpeed Error',response.status);
			
		});
    };
    $scope.refresh();
    
    
    $interval(function(){
		$scope.refresh();
		
    },5*1000);



});
