'use strict';

/* global define */

define(
  [
    'app',
    'services/authentication',
    'services/session'
  ],

  function(app) {
    app.register.controller('SignupController',
      [
        '$scope',
        '$log',
        '$location',
        'authenticationService',
        'sessionService',

        function($scope, $log, $location, authenticationService, sessionService) {
          $scope.yourName = '';
          $scope.email = '';
          $scope.password = '';
          $scope.verifyPassword = '';

          $scope.go = function(hash) {
            $location.path(hash);
          };

          $scope.formSubmit = function() {
            var signupUser = {
              name: $scope.yourName,
              email: $scope.email,
              password: $scope.password
            };
            authenticationService.signup(signupUser).then(function(user) {
              // User signed. Redirect to inbox.
              sessionService.setUser(user);
              $scope.go('/inbox');
            }, function(errorCode) {
              $log.error('Signup error: ' + errorCode);
            });
          };
        }
      ]);
  });
