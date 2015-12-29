/* global angular */
/* global CryptoJS */
/* global APPLICATION_NAME */
(function() {
  'use strict';

  angular.module(APPLICATION_NAME)
    .service('imapService', ['$log', '$q', 'objectStoreService', 'cryptoService',
      function($log, $q, objectStoreService, cryptoService) {
        var self = this;

        self.SECURITY_NONE = 'None';
        self.SECURITY_STARTTLS = 'STARTTLS';
        self.SECURITY_SSLTLS = 'SSL/TLS';
        self.AUTHENTICATION_PLAIN = 'Normal password';
        self.AUTHENTICATION_ENCRYPTED = 'Encrypted password';
        self.AUTHENTICATION_KERBEROS = 'Kerberos';
        self.AUTHENTICATION_NTLM = 'NTLM';
        self.AUTHENTICATION_TLSCERT = 'TLS certificate';
        self.AUTHENTICATION_OAUTH2 = 'OAuth2';

        self.defaultSettings = function() {
          return {
            username: '',
            password: '',
            address: '',
            port: 143,
            protocol: self.SECURITY_NONE,
            authentication: self.AUTHENTICATION_PLAIN
          };
        };

        self.availableSecurityProtocols = function() {
          return [{
            name: 'None',
            port: 143
          }, {
            name: 'STARTTLS',
            port: 143
          }, {
            name: 'SSL/TLS',
            port: 993
          }];
        };

        self.availableAuthenticationMethods = function() {
          return [
            self.AUTHENTICATION_PLAIN,
            self.AUTHENTICATION_ENCRYPTED,
            self.AUTHENTICATION_KERBEROS,
            self.AUTHENTICATION_NTLM,
            self.AUTHENTICATION_TLSCERT,
            self.AUTHENTICATION_OAUTH2
          ];
        };
      }]);
})();
