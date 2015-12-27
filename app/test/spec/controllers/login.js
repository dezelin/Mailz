/* global beforeEach */
/* global describe */
/* global expect */
/* global inject */
/* global it */
(function() {
  'use strict';

  describe('Testing Login controller', function() {
    var ctrl;
    var $scope, $location, $timeout;

    beforeEach(function() {
      module('MailzApp');
      inject(function($rootScope, $controller, $q, _$location_, _$timeout_) {
        // Create a root scope
        $scope = $rootScope.$new();
        // Controller dependency
        $location = _$location_;
        // Need to flush unresolved promises
        $timeout = _$timeout_;
        // Bind controller to scope
        ctrl = $controller('LoginCtrl', {
          $scope: $scope,
          $location: $location
        });
      });
    });

    it('should start with username empty', function() {
      expect($scope.username).toEqual('');
    });

    it('should start with password empty', function() {
      expect($scope.password).toEqual('');
    });
  });
})();
