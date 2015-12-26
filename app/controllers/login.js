(function () {
	'use strict'
	
	angular.module('MailzApp').controller('LoginCtrl', ['$scope', '$location', 'Authentication', 
	function ($scope, $location, $authentication) {
		$scope.username = ''
		$scope.password = ''
	
		$scope.go = function (hash) {
			$location.path(hash)		
		}
		
		$scope.formSubmit = function () {
			console.log($authentication.authenticate($scope.password))
		}
	}]);
})();