(function () {
	'use strict'
	
	angular.module('MailzApp')
		.controller('SignupCtrl', ['$scope', '$location', 'authenticationService'
			, function ($scope, $location, authenticationService) {
				$scope.yourName = '';
				$scope.email = '';
				$scope.password = '';
				$scope.verifyPassword = '';
				
				$scope.go = function (hash) {
					$location.path(hash);
				}
				
				$scope.formSubmit = function () {
					var signupUser = {
						name: $scope.yourName, 
						email: $scope.email, 
						password: $scope.password
					};
					authenticationService.signup(signupUser).then(function (user) {
						// User signed. Redirect to inbox.
						$scope.go('/inbox');	
					}, function (errorCode) {
						
					});
				}
			}
		]);
})();
