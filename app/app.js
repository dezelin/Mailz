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
          .when('/inbox', route.resolve('Inbox'))
          .when('/login', route.resolve('Login'))
          .when('/signup', route.resolve('Signup'))
          .otherwise({redirectTo: '/'});

        return app;
      }
    ]);

    /*
    app.run([
      '$q',
      'use$q',
      '$rootScope',
      '$location',
      'authService',

      function($q, use$q, $rootScope, $location, authService) {
        // Client-side security. Server-side framework MUST add it's
        // own security as well since client-based security is easily hacked
        $rootScope.$on('$routeChangeStart', function(event, next) {
          if (next && next.$$route && next.$$route.secure) {
            if (!authService.user.isAuthenticated) {
              authService.redirectToLogin();
            }
          }
        });
      }
    ]);
    */

    return app;
  });
