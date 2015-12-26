(function () {
	'use strict'
	
	angular.module('MailzApp').controller('SignupCtrl', ['$scope', '$location', function ($scope, $location) {
		$scope.yourName = '';
		$scope.email = '';
		$scope.password = '';
		$scope.verifyPassword = '';
		
		$scope.go = function (hash) {
			$location.path(hash);
		}
		
		$scope.formSubmit = function () {
			$scope.go('/inbox');	
		}
	}]);
})();
