myApp.directive('hueLampSliders',
	function() {
		return {
			restrict: 'E',
			scope: {
				light: '='
			},
			templateUrl: 'js/lamp.directive.html'
		}
	}
)



