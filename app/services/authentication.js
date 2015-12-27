/* global angular */
/* global APPLICATION_NAME */
(function() {
  'use strict';

  angular.module(APPLICATION_NAME)
    .service('authenticationService', ['$log', '$q', 'objectStoreService', 'cryptoService',
      function($log, $q, objectStoreService, cryptoService) {
        var self = this;

        self.ACCESS_DENIED = 'Authentication failure.';
        self.USER_EXISTS = 'User already exists.';

        // Login user
        self.login = function(user) {
          var p = $q.defer();
          objectStoreService.findUserByEmail(user.email).then(function(foundUser) {
            var hash = cryptoService.hash(user.password);
            if (hash === foundUser.password) {
              foundUser.token = cryptoService.token();
              p.resolve(foundUser);
            } else {
              p.reject(self.ACCESS_DENIED);
            }
          }, function(errorCode) {
            p.reject(errorCode);
          });

          return p.promise;
        };

        // Signup user
        self.signup = function(user) {
          var p = $q.defer();
          objectStoreService.findUserByEmail(user.email).then(function() {
            // User already exists
            p.reject(self.USER_EXISTS);
          }, function(errorCode) {
            if (errorCode === null || errorCode !== objectStoreService.USER_NOT_FOUND) {
              p.reject(errorCode);
            } else {
              var insertUser = {
                name: user.name,
                email: user.email,
                password: cryptoService.hash(user.password)
              };

              // Add new user
              objectStoreService.addUser(insertUser).then(function() {
                // Login user to get access token
                self.login(user).then(function(user) {
                  p.resolve(user);
                }, function(errorCode) {
                  p.reject(errorCode);
                });
              }, function(errorCode) {
                p.reject(errorCode);
              });
            }
          });

          return p.promise;
        };
      }
    ]);
})();
