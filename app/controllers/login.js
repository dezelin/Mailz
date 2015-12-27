(function () {
	'use strict'
	
	angular.module('MailzApp').controller('LoginCtrl', ['$scope', '$location', 
	function ($scope, $location) {
		$scope.username = ''
		$scope.password = ''
	
		$scope.go = function (hash) {
			$location.path(hash)		
		}
		
		$scope.formSubmit = function () {
			
		}
	}]);
})();