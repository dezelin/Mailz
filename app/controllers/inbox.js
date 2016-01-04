'use strict';

/* global define */

define(
  [
    'lodash',
    'app',
    'services/modals',
    'services/session'
  ],

  function(_, app) {
    app.register.controller('InboxController',
      [
        '$scope',
        '$log',
        'objectStoreService',
        'sessionService',
        'modalsService',

        function($scope, $log, objectStoreService, sessionService, modalsService) {
          var self = this;

          self.showOptions = function() {
            self.user.options = self.user.options || {};
            return modalsService.showOptions(self.user.options);
          };

          // Check if user have options defined
          self.user = sessionService.getUser();
          if (!('options' in self.user) || self.user.options === null) {
            // Bring up Options dialog the first time the user have signed in
            self.showOptions().then(function(options) {
              self.user.options = options;
              sessionService.setUser(self.user);
              objectStoreService.saveOptions(self.user, self.user.options).then(function(list) {
                $log.info(list);
              }, function(error) {
                $log.error(error.message);
              });
            });
          }
        }
      ]);
  });
