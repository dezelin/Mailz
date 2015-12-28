/* global angular */
/* global CryptoJS */
/* global APPLICATION_NAME */
(function() {
  'use strict';

  angular.module(APPLICATION_NAME)
    .service('imapService', ['$log', '$q', 'objectStoreService', 'cryptoService',
      function($log, $q, objectStoreService, cryptoService) {
        var self = this;
      }]);
})();
