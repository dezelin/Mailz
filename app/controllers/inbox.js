/* global angular */
/* global APPLICATION_NAME */
(function() {
  'use strict';

  angular.module(APPLICATION_NAME)
    .controller('InboxCtrl', ['$scope', '$log', 'sessionService', 'modalsService',
      function($scope, $log, sessionService, modalsService) {
        var self = this;

        self.showOptions = function() {
          self.user.options = self.user.options || { a: 'a'};
          return modalsService.showOptions(self.user.options);
        };

        // Check if user has options defined
        self.user = sessionService.getUser();
        if (!('options' in self.user) || self.user.options === null) {
          // Bring up Options dialog the first time the user have signed in
          self.showOptions().then(function(options) {
            self.user.options = options;
          });
        }
      }
    ]);
})();
