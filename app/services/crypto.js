'use strict';

/* global define */

define(
  [
    'app',
    'crypto-js'
  ],

  function(app, cryptoJs) {
    app.register.service('cryptoService',
      [
        '$log',

        function($log) {
          var self = this;

          self.hash = function(message) {
            return cryptoJs.SHA256(message).toString(cryptoJs.enc.Hex);
          };

          self.token = function() {
            return cryptoJs.lib.WordArray.random(32).toString(cryptoJs.enc.Hex);
          };
        }]);
  });
