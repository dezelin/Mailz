'use strict';

/* global define */

define(
  [
    'app'
  ],

  function(app) {
    app.register.service('sessionService', function() {
      var self = this;

      self.user = {};

      self.setUser = function(user) {
        self.user = user;
      };

      self.getUser = function() {
        return self.user;
      };
    });
  });
