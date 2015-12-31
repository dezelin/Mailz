'use strict';

/* global define */

define(
  [
    'app',
    'angular-block-ui',
    'angular-bootstrap',
    'services/imap',
    'services/modals',
    'services/smtp'
  ],

  function(app) {
    app.register.controller('OptionsController',

      function($scope, $log, $uibModalInstance, context) {
        $scope.tabs = [{
          title: 'Personal',
          templateUrl: 'app/views/dialogs/options/personal.html',
          active: true
        }, {
          title: 'Settings',
          templateUrl: 'app/views/dialogs/options/settings.html'
        }, {
          title: 'Accounts',
          templateUrl: 'app/views/dialogs/options/accounts.html'
        }];

        $scope.context = context;
      });

    app.register.controller('OptionsAccountsController',
      [
        '$scope',
        '$log',
        'modalsService',

        function($scope, $log, modalsService) {
          $scope.accounts = {
            list: $scope.context.accounts || [],
            pageIdx: -1
          };

          $scope.pageTemplates = [{
            name: 'IMAP Server',
            testable: true,
            templateUrl: 'app/views/dialogs/options/imap.html'
          }, {
            name: 'SMTP Server',
            testable: true,
            templateUrl: 'app/views/dialogs/options/smtp.html'
          }, {
            name: 'Composition & Formatting',
            testable: false,
            templateUrl: 'app/views/dialogs/options/composition.html'
          }, {
            name: 'Security',
            testable: false,
            templateUrl: 'app/views/dialogs/options/security.html'
          }];

          $scope.broadcastReload = function() {
            // broadcast to child controllers that they need to be reload
            $scope.$broadcast('reloadAccount');
          };

          $scope.broadcastTest = function() {
            $scope.$broadcast('test');
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

          $scope.accounts.isPageTestable = function() {
            if ($scope.accounts.pageIdx === -1) {
              return false;
            }

            return $scope.pageTemplates[$scope.accounts.pageIdx].testable;
          };

          $scope.accounts.rename = function() {
            if (!$scope.accounts.isAccountSelected()) {
              return;
            }

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

            var idx = $scope.accounts.selectedAccount();
            $scope.accounts.list.splice(idx, 1);
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

    app.register.controller('OptionsAccountsIMAPController',
      [
        '$scope',
        '$log',
        '$timeout',
        'blockUI',
        'imapService',

        function($scope, $log, $timeout, blockUI, imapService) {
          $scope.securityProtocols = imapService.availableSecurityProtocols();
          $scope.authenticationMethods = imapService.availableAuthenticationMethods();

          $scope.account = $scope.account || {};
          $scope.account.imap = $scope.account.imap || {};
          $scope.account.imap.protocol = $scope.account.imap.protocol || $scope.securityProtocols[0].name;

          $scope.$watch('account.imap.protocol', function(newValue, oldValue) {
            if (oldValue === undefined || newValue === undefined ||
              oldValue === newValue) {
              return;
            }

            // $scope.account.imap.protocol has already been set to the new value in the view
            for (var i = 0; i < $scope.securityProtocols.length; ++i) {
              if ($scope.securityProtocols[i].name === newValue) {
                $scope.account.imap.port = $scope.securityProtocols[i].port;
                break;
              }
            }
          });

          $scope.reload = function() {
            // Schedule update for the next tick
            $timeout(function() {
              $scope.$apply(function() {
                $scope.account = $scope.accounts.list[$scope.accounts.selectedAccount()];
                $scope.account.imap = $scope.account.imap || imapService.defaultSettings();
              });
            });
          };

          $scope.test = function() {
            // Block UI
            blockUI.start('Testing connection...');
            imapService.test($scope.account.imap).then(function(result) {
              $timeout(blockUI.stop, 1000);
              $log.info('Testing IMAP settings passed.');
            }, function(error) {
              blockUI.message(error.message);
              $timeout(blockUI.stop, 4000);
              $log.error('Testing IMAP settings failed. ' + error);
            });
          };

          $scope.reloadHandler = function() {
            $scope.reload();
          };

          $scope.testHandler = function() {
            $scope.test();
          };

          // Handle test broadcasts
          $scope.$on('test', $scope.testHandler);

          // Reload account data on model change
          $scope.$on('reloadAccount', $scope.reloadHandler);
          $scope.reload();
        }]);

    app.register.controller('OptionsAccountsSMTPController',
      [
        '$scope',
        '$log',
        '$timeout',
        'blockUI',
        'smtpService',

        function($scope, $log, $timeout, blockUI, smtpService) {
          $scope.securityProtocols = smtpService.availableSecurityProtocols();
          $scope.authenticationMethods = smtpService.availableAuthenticationMethods();

          $scope.account = $scope.account || {};
          $scope.account.smtp = $scope.account.smtp || {};
          $scope.account.smtp.protocol = $scope.account.smtp.protocol || $scope.securityProtocols[0].name;

          $scope.$watch('account.smtp.protocol', function(newValue, oldValue) {
            if (oldValue === undefined || newValue === undefined ||
              oldValue === newValue) {
              return;
            }

            // $scope.account.smtp.protocol has already been set to the new value in the view
            for (var i = 0; i < $scope.securityProtocols.length; ++i) {
              if ($scope.securityProtocols[i].name === newValue) {
                $scope.account.smtp.port = $scope.securityProtocols[i].port;
                break;
              }
            }
          });

          $scope.reload = function() {
            // Schedule update for the next tick
            $timeout(function() {
              $scope.$apply(function() {
                $scope.account = $scope.accounts.list[$scope.accounts.selectedAccount()];
                $scope.account.smtp = $scope.account.smtp || smtpService.defaultSettings();
              });
            });
          };

          $scope.test = function() {
            // Block UI
            blockUI.start('Testing connection...');
            smtpService.test($scope.account.smtp).then(function(result) {
              $timeout(blockUI.stop, 1000);
              $log.info('Testing SMTP settings passed.');
            }, function(error) {
              blockUI.message(error.message);
              $timeout(blockUI.stop, 4000);
              $log.error('Testing SMTP settings failed. ' + error);
            });
          };

          $scope.reloadHandler = function() {
            $scope.reload();
          };

          $scope.testHandler = function() {
            $scope.test();
          };

          // Handle test broadcasts
          $scope.$on('test', $scope.testHandler);

          // Reload account data on model change
          $scope.$on('reloadAccount', $scope.reloadHandler);
          $scope.reload();
        }]);

    app.register.controller('OptionsAccountsCompositionController',
      [
        '$scope',
        '$log',

        function($scope, $log) {

        }]);

    app.register.controller('OptionsAccountsSecurityController',
      [
        '$scope',
        '$log',

        function($scope, $log) {

        }]);

    app.register.controller('OptionsPersonalController',
      [
        '$scope',
        '$log',

        function($scope, $log) {

        }]);

    app.register.controller('OptionsSettingsController',
      [
        '$scope',
        '$log',

        function($scope, $log) {

        }]);

    app.register.controller('OptionsAddAccountController',
      [
        '$scope',
        '$log',
        '$uibModalInstance',

        function($scope, $log, $uibModalInstance) {
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

    app.register.controller('OptionsRenameAccountController',
      [
        '$scope',
        '$log',
        '$uibModalInstance',
        'context',

        function($scope, $log, $uibModalInstance, context) {
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
  });
