/* global angular */
/* global APPLICATION_NAME */
(function() {
  angular.module(APPLICATION_NAME)
    .service('modalsService', ['$log', '$q', '$uibModal', function($log, $q, $uibModal) {
      var self = this;

      self.showOptions = function(_context_) {
        var instance = $uibModal.open({
          animation: true,
          backdrop: false,
          templateUrl: 'app/dialogs/options/options.html',
          controller: 'OptionsCtrl',
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
          templateUrl: 'app/dialogs/options/addAccount.html',
          controller: 'OptionsAddAccountCtrl',
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
          templateUrl: 'app/dialogs/options/renameAccount.html',
          controller: 'OptionsRenameAccountCtrl',
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
})();
