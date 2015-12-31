'use strict';

/* global angular */
/* global define */

var APPLICATION_NAME = 'MailzApp';
var APPLICATION_VERSION = '0.0.1';

define(
  [
    'angular',
    'angular-block-ui',
    'angular-bootstrap',
    'angular-messages',
    'angular-route',
    'services/routeResolver'
  ],
  function(angular) {
    var app = angular.module(APPLICATION_NAME,
      [
        'ngRoute',
        'ngMessages',
        'ui.bootstrap',
        'blockUI',
        'routeResolverService'
      ]);

    app.config([
      '$routeProvider',
      'routeResolverProvider',
      '$controllerProvider',
      '$compileProvider',
      '$filterProvider',
      '$provide',

      function($routeProvider, routeResolverProvider, $controllerProvider,
        $compileProvider, $filterProvider, $provide) {
        // Register providers
        app.register = {
          controller: $controllerProvider.register,
          directive: $compileProvider.directive,
          filter: $filterProvider.register,
          factory: $provide.factory,
          service: $provide.service
        };

        // Route service
        var route = routeResolverProvider.route;

        // Define routes
        $routeProvider
          .when('/', {redirectTo: '/login'})
          .when('/inbox', route.resolve('Inbox', '', true))
          .when('/login', route.resolve('Login'))
          .when('/signup', route.resolve('Signup'))
          .otherwise({redirectTo: '/'});

        return app;
      }
    ]);

    app.run([
      '$q',
      '$rootScope',
      '$location',
      '$injector',

      function($q, $rootScope, $location, $injector) {
        // Client-side security. Server-side framework MUST add it's
        // own security as well since client-based security is easily hacked
        $rootScope.$on('$routeChangeStart', function(event, next) {
          var authenticationService = require(['services/authentication']);
          if (next && next.$$route && next.$$route.secure) {
            if (!authenticationService.isUserAuthenticated()) {
              authenticationService.redirectToLogin();
            }
          }
        });
      }
    ]);

    return app;
  });
