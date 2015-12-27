/* global angular */
/* global APPLICATION_NAME */
(function() {
  'use strict';

  angular.module(APPLICATION_NAME)
    .service('sessionService', ['$log', function($log) {
      var self = this;

      self.user = {};

      self.setUser = function(user) {
        self.user = user;
      };

      self.getUser = function() {
        return self.user;
      };
    }]);
})();
