
angular.module('gui.news', []).controller('NewsCtrl', function NewsCtrl($scope, $interval, $timeout, $http) {
	
    $scope.count = -1;
    $scope.current = -1;
    $scope.image = '';
    $scope.headline = '';
    $scope.articles = [];

    $scope.init = function() {
    console.log('start NewsCtrl');
    
    };
    $scope.init();
    
    $scope.change = function()
    {
        console.log($scope.articles.length);
        $scope.current++;
        if ($scope.current >= $scope.count)
        {
            $scope.current=0;
        }
        $scope.image = $scope.articles[$scope.current].urlToImage;
        $scope.title = $scope.articles[$scope.current].title;
    }
    $scope.refresh = function()
    {
        $http({
			method : 'GET',
			url : 'https://newsapi.org/v2/top-headlines?sources='+newsapi_sources+'&apiKey='+newsapi_apikey,
		}).then(function successCallback(response) {
			console.log('NewsApi',response);
			$scope.articles = response.data.articles;
			$scope.count = $scope.articles.length;
			
            $scope.current = -1;
            $scope.change();
		}, function errorCallback(response) {
			console.log('NewsApi Error',response.status);
			
		});
    };
    $scope.refresh();
    
    
    $interval(function(){
		$scope.refresh();
		
    },10*60*1000);

    $interval(function(){
		$scope.change();
		
    },5*1000);

});
