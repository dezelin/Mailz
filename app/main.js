'use strict';

/* global angular */
/* global document */
require.config({
  baseUrl: '/app',
  urlArgs: 'v=1.0',

  // Alias library paths
  paths: {
    'addressparser': 'components/addressparser/src/addressparser',
    'angular': 'components/angular/angular.min',
    'angular-bootstrap': 'components/angular-bootstrap/ui-bootstrap-tpls.min',
    'angular-messages': 'components/angular-messages/angular-messages.min',
    'angular-route': 'components/angular-route/angular-route.min',
    'axe': 'components/axe-core/axe.min',
    'browserbox': 'components/browserbox/src/browserbox',
    'browserbox-compression': 'components/browserbox/src/browserbox-compression',
    'browserbox-imap': 'components/browserbox/src/browserbox-imap',
    'browserbox-pako': 'components/browserbox/src/browserbox-pako',
    'crypto-js': 'components/crypto-js/crypto-js',
    'domReady': 'components/requirejs-domready/domReady',
    'forge': 'components/forge/js/forge.min',
    'imap-compiler': 'components/imapHandler/src/imap-compiler',
    'imap-client': 'components/imap-client/imap-client',
    'imap-handler': 'components/imapHandler/src/imap-handler',
    'imap-formal-syntax': 'components/imapHandler/src/imap-formal-syntax',
    'imap-parser': 'components/imapHandler/src/imap-parser',
    'mimefuncs': 'components/mimefuncs/src/mimefuncs',
    'stringencoding': 'components/stringencoding/dist/stringencoding.min',
    'tcp-socket': 'components/tcp-socket/src/tcp-socket',
    'tcp-socket-tls': 'components/tcp-socket/src/tcp-socket-tls',
    'utf7': 'components/utf7/src/utf7'
  },

  // Angular and these modules does not support AMD. Put them in a shim
  shim: {
    'angular': {
      exports: 'angular'
    },
    'angular-bootstrap': {
      exports: 'angular-bootstrap',
      deps: ['angular']
    },
    'angular-messages': {
      exports: 'angular-messages',
      deps: ['angular']
    },
    'angular-route': {
      exports: 'angular-route',
      deps: ['angular']
    },
    'axe': {
      exports: 'axe'
    },
    'crypto-js': {
      exports: 'crypto-js'
    },
    'forge': {
      exports: 'forge'
    }
  }
});

require(
  [
    'angular',
    'angular-bootstrap',
    'angular-messages',
    'angular-route',
    'app',
    'services/routeResolver'
  ],
  function() {
    angular.bootstrap(document, ['MailzApp']);
  });
