'use strict';

/* global define */

define(
  [
    'app',
    'controllers/options'
  ],

  function(app) {
    app.register.service('modalsService',
      [
        '$log',
        '$q',
        '$uibModal',

        function($log, $q, $uibModal) {
          var self = this;

          self.showOptions = function(_context_) {
            var instance = $uibModal.open({
              animation: true,
              backdrop: false,
              templateUrl: 'app/views/dialogs/options/options.html',
              controller: 'OptionsController',
              size: 'lg',
              resolve: {
                context: function() {
                  return _context_;
                }
              }
            });

            var p = $q.defer();
            instance.result.then(function(result) {
              p.resolve(result);
            }, function(reason) {
              p.reject(reason);
            });

            return p.promise;
          };

          self.showOptionsAddAccount = function(_context_) {
            var instance = $uibModal.open({
              animation: true,
              backdrop: false,
              templateUrl: 'app/views/dialogs/options/addAccount.html',
              controller: 'OptionsAddAccountController',
              size: 'sm',
              resolve: {
                context: function() {
                  return _context_;
                }
              }
            });

            var p = $q.defer();
            instance.result.then(function(result) {
              p.resolve(result);
            }, function(reason) {
              p.reject(reason);
            });

            return p.promise;
          };

          self.showOptionsRenameAccount = function(_context_) {
            var instance = $uibModal.open({
              animation: true,
              backdrop: false,
              templateUrl: 'app/views/dialogs/options/renameAccount.html',
              controller: 'OptionsRenameAccountController',
              size: 'sm',
              resolve: {
                context: function() {
                  return _context_;
                }
              }
            });

            var p = $q.defer();
            instance.result.then(function(result) {
              p.resolve(result);
            }, function(reason) {
              p.reject(reason);
            });

            return p.promise;
          };
        }]);
  });
