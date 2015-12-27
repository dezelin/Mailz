; (function () {
	'use strict'

	angular.module(APPLICATION_NAME)
		.controller('LoginCtrl', ['$scope', '$location', function ($scope, $location) {
			$scope.username = ''
			$scope.password = ''

			$scope.go = function (hash) {
				$location.path(hash)
			}

			$scope.formSubmit = function () {

			}
		}]);
})();