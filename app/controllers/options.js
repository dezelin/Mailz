/* global angular */
/* global APPLICATION_NAME */
(function() {
  angular.module(APPLICATION_NAME)
    .controller('OptionsCtrl', function($scope, $log, $uibModalInstance, context) {
      $scope.tabs = [{
        title: 'Personal',
        templateUrl: 'app/dialogs/options/personal.html',
        active: true
      }, {
        title: 'Settings',
        templateUrl: 'app/dialogs/options/settings.html'
      }, {
        title: 'Accounts',
        templateUrl: 'app/dialogs/options/accounts.html'
      }];

      $scope.context = context;
    });

  angular.module(APPLICATION_NAME)
    .controller('OptionsAccountsCtrl', ['$scope', '$log', 'modalsService',
      function($scope, $log, modalsService) {
        $scope.accounts = {
          list: $scope.context.accounts || [],
          pageIdx: -1
        };

        $scope.pageTemplates = [{
          name: 'IMAP Server',
          templateUrl: 'app/dialogs/options/imap.html'
        }, {
          name: 'SMTP Server',
          templateUrl: 'app/dialogs/options/smtp.html'
        }, {
          name: 'Composition & Formatting',
          templateUrl: 'app/dialogs/options/composition.html'
        }, {
          name: 'Security',
          templateUrl: 'app/dialogs/options/security.html'
        }];

        $scope.broadcastReload = function() {
          // broadcast to child controllers that they need to be reload
          $scope.$broadcast('reloadAccount');
        };

        $scope.selectedPageTemplate = function() {
          if ($scope.accounts.pageIdx === -1) {
            return '';
          }

          if (!$scope.accounts.isAccountSelected()) {
            return '';
          }

          return $scope.pageTemplates[$scope.accounts.pageIdx].templateUrl;
        };

        $scope.accounts.add = function() {
          modalsService.showOptionsAddAccount().then(function(result) {
            $scope.accounts.list.push({name: result.name, open: true});
            $scope.accounts.pageIdx = 0;
            $scope.broadcastReload();
          });
        };

        $scope.accounts.clickPageLink = function(pageIdx) {
          $scope.accounts.pageIdx = pageIdx;
        };

        $scope.accounts.isAccountSelected = function() {
          return $scope.accounts.selectedAccount() !== -1;
        };

        $scope.accounts.rename = function() {
          var idx = $scope.accounts.selectedAccount();
          var account = $scope.accounts.list[idx];
          var context = {name: account.name};
          modalsService.showOptionsRenameAccount(context).then(function(result) {
            account.name = result.name;
            $scope.broadcastReload();
          });
        };

        $scope.accounts.removeSelected = function() {
          if (!$scope.accounts.isAccountSelected()) {
            return;
          }

          $scope.accounts.list.splice($scope.accounts.selectedAccount(), 1);
          $scope.$digest();
        };

        $scope.accounts.selectedAccount = function() {
          var idx = -1;
          for (var i = 0; i < $scope.accounts.list.length; ++i) {
            if ($scope.accounts.list[i].open) {
              idx = i;
              break;
            }
          }

          return idx;
        };

        $scope.actionButton = {
          actions: [{
            name: 'Add account',
            action: $scope.accounts.add,
            enabled: function() {
              return true;
            }
          }, {
            name: 'Remove account',
            action: $scope.accounts.removeSelected,
            enabled: $scope.accounts.isAccountSelected
          }, {
            name: 'Rename account',
            action: $scope.accounts.rename,
            enabled: $scope.accounts.isAccountSelected
          }]
        };

        $scope.actionButton.click = function(idx) {
          $scope.actionButton.actions[idx].action();
        };
      }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsAccountsIMAPCtrl', ['$scope', '$log', function($scope, $log) {
      $scope.reload = function() {
        // Schedule update for the next tick
        setTimeout(function() {
          $scope.$apply(function() {
            $scope.account = $scope.accounts.list[$scope.accounts.selectedAccount()];
            $scope.account.imap = $scope.account.imap || {};
          });
        }, 0);
      };

      $scope.reloadHandler = function() {
        $scope.reload();
      };

      // Reload account data on model change
      $scope.$on('reloadAccount', $scope.reloadHandler);
      $scope.reload();
    }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsAccountsSMTPCtrl', ['$scope', '$log', function($scope, $log) {

    }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsAccountsCompositionCtrl', ['$scope', '$log', function($scope, $log) {

    }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsAccountsSecurityCtrl', ['$scope', '$log', function($scope, $log) {

    }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsPersonalCtrl', ['$scope', '$log', function($scope, $log) {

    }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsSettingsCtrl', ['$scope', '$log', function($scope, $log) {

    }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsAddAccountCtrl', ['$scope', '$log', '$uibModalInstance', function($scope, $log, $uibModalInstance) {
      $scope.accountName = '';

      $scope.isValid = function() {
        return $scope.accountName.length > 0;
      };

      $scope.ok = function() {
        $uibModalInstance.close({name: $scope.accountName});
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }]);

  angular.module(APPLICATION_NAME)
    .controller('OptionsRenameAccountCtrl', ['$scope', '$log', '$uibModalInstance', 'context', function($scope, $log, $uibModalInstance, context) {
      var ctx = context || {};
      $scope.accountName = ctx.name || '';

      $scope.isValid = function() {
        return $scope.accountName.length > 0;
      };

      $scope.ok = function() {
        $uibModalInstance.close({name: $scope.accountName});
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }]);

})();
