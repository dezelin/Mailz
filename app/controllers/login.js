/* global angular */
/* global APPLICATION_NAME */
(function() {
  'use strict';

  angular.module(APPLICATION_NAME)
    .controller('LoginCtrl', ['$scope', '$log', '$location', 'authenticationService', 'sessionService',
      function($scope, $log, $location, authenticationService, sessionService) {
        $scope.email = '';
        $scope.password = '';

        $scope.go = function(hash) {
          $location.path(hash);
        };

        $scope.formSubmit = function() {
          var user = {
            email: $scope.email,
            password: $scope.password
          };
          authenticationService.login(user).then(function(user) {
            sessionService.setUser(user);
            $scope.go('/inbox');
          }, function(errorCode) {
            $log.error('Login error: ' + errorCode);
          });
        };
      }]);
})();
