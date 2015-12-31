'use strict';

/* global define */
/* global require */

define(
  [
    'angular'
  ],

  function(angular) {
    var routeResolver = function() {
      this.$get = function() {
        return this;
      };

      this.routeConfig = (function() {
        var viewsDirectory = '/app/views/';
        var controllersDirectory = '/app/controllers/';
        var directivesDirectory = '/app/directives';
        var servicesDirectory = '/app/services';

        var setBaseDirectories = function(viewsDir, controllersDir, servicesDir, directivesDir) {
          viewsDirectory = viewsDir;
          controllersDirectory = controllersDir;
          directivesDirectory = directivesDir;
          servicesDirectory = servicesDir;
        };

        var getViewsDirectory = function() {
          return viewsDirectory;
        };

        var getControllersDirectory = function() {
          return controllersDirectory;
        };

        var getDirectivesDirectory = function() {
          return directivesDirectory;
        };

        var getServicesDirectory = function() {
          return servicesDirectory;
        };

        return {
          setBaseDirectories: setBaseDirectories,
          getControllersDirectory: getControllersDirectory,
          getDirectivesDirectory: getDirectivesDirectory,
          getServicesDirectory: getServicesDirectory,
          getViewsDirectory: getViewsDirectory
        };
      })();

      this.route = (function(routeConfig) {
        var resolveDependencies = function($q, $rootScope, dependencies) {
          var defer = $q.defer();
          require(dependencies, function() {
            defer.resolve();
            $rootScope.$apply();
          });

          return defer.promise;
        };

        var resolve = function(baseName, path, secure) {
          path = path || '';
          var routeDef = {};
          var fileName = baseName.toLowerCase();
          routeDef.templateUrl = routeConfig.getViewsDirectory() + path + fileName + '.html';
          routeDef.controller = baseName + 'Controller';
          routeDef.secure = (secure) ? secure : false;
          routeDef.resolve = {
            load: ['$q', '$rootScope', function($q, $rootScope) {
              var dependencies = [routeConfig.getControllersDirectory() + path + fileName + '.js'];
              return resolveDependencies($q, $rootScope, dependencies);
            }]
          };

          return routeDef;
        };

        return {
          resolve: resolve
        };
      })(this.routeConfig);
    };

    var servicesApp = angular.module('routeResolverService', []);

    // Must be a provider since it will be injected into module.config()
    servicesApp.provider('routeResolver', routeResolver);
  });
