'use strict';

/* global define */
/* global APPLICATION_NAME */
/* global APPLICATION_VERSION */

define(
  [
    'app',
    'browserbox'
  ],

  function(app, browserbox) {
    app.register.service('imapService',
      [
        '$log',
        '$q',

        function($log, $q) {
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

          var BrowserBox = require('browserbox');

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

          self.test = function(options) {
            var p = $q.defer();
            var client = new BrowserBox(options.address, options.port, {
              auth: {
                user: options.username,
                pass: options.password
              },
              id: {
                name: APPLICATION_NAME,
                version: APPLICATION_VERSION
              }
            });
            client.onerror = function(error) {
              p.reject(error);
            };
            client.onclose = function() {
              p.resolve();
            };
            client.onauth = function() {
              p.resolve();
            };
            return p.promise;
          };
        }]);
  });
