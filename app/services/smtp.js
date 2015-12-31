'use strict';

/* global define */
/* global APPLICATION_NAME */
/* global APPLICATION_VERSION */

define(
  [
    'app',
    'smtpclient'
  ],

  function(app) {
    app.register.service('smtpService',
      [
        '$log',
        '$q',
        '$timeout',

        function($log, $q, $timeout) {
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
              port: 25,
              protocol: self.SECURITY_NONE,
              authentication: self.AUTHENTICATION_PLAIN
            };
          };

          self.availableSecurityProtocols = function() {
            return [{
              name: 'None',
              port: 25
            }, {
              name: 'STARTTLS',
              port: 587
            }, {
              name: 'SSL/TLS',
              port: 465
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

          var SmtpClient = require('smtpclient');

          self.test = function(options) {
            var p = $q.defer();
            var client = new SmtpClient(options.address, options.port, {
              auth: {
                user: options.username,
                pass: options.password
              },
              id: {
                name: APPLICATION_NAME,
                version: APPLICATION_VERSION
              },
              useSecureTransport: options.protocol === self.SECURITY_SSLTLS ||
                options.protocol === self.SECURITY_STARTTLS,
              requireTLS: options.protocol === self.SECURITY_STARTTLS
            });
            client.onerror = function(error) {
              client.close();
              p.reject(error);
            };
            client.onclose = function() {
              client.close();
              p.resolve();
            };
            client.onidle = function() {
              client.quit();
              p.resolve();
            };

            $timeout(client.connect());
            return p.promise;
          };
        }]);
  });
