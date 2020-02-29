
angular.module('gui.launcher', []).controller('LauncherCtrl', function LauncherCtrl($scope, $interval, $http) {
	
    
    $scope.apps =
    [
  
        {
          "label": "all 4 hue",
          "component": "de.renewahl.all4hue\/de.renewahl.all4hue.activities.ActivityStartup"
        },
        {
          "label": "Amazon Alexa",
          "component": "com.amazon.dee.app\/com.amazon.dee.app.Launcher"
        },
        {
          "label": "Audible",
          "component": "com.audible.application.kindle\/com.audible.application.firetablet.activity.MainActivity"
        },
        {
          "label": "Hue",
          "component": "com.philips.lighting.hue2\/com.philips.lighting.hue2.ContentActivity"
        },
        {
          "label": "LG TV Plus",
          "component": "com.lge.app1\/com.lge.app1.activity.SplashActivity"
        },
        {
          "label": "Prime Video",
          "component": "com.amazon.avod\/com.amazon.avod.client.activity.HomeScreenActivity"
        },
        {
          "label": "Musik",
          "component": "com.amazon.mp3\/com.amazon.mp3.client.activity.LauncherActivity"
        }
      ];

    $scope.init = function() {
    console.log('start LauncherCtrl');
      
    };
    $scope.init();
    
    $scope.startApp = function(app)
    {
        console.log('Start', app);
        appId = app.component.split("\/")[0];
        fully.startApplication(appId);
    }
    $scope.refresh = function()
    {
        
        
    };
    $scope.refresh();
    
    
    // $interval(function(){
	// 	$scope.refresh();
		
    // },30*60*1000);



});
