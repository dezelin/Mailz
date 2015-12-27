/* global beforeEach */
/* global describe */
/* global expect */
/* global inject */
/* global it */
/* global jasmine */
(function() {
  describe('Testing Signup controller', function() {
    var ctrl;
    var $scope, $location, $timeout;
    var authenticationServiceMock;

    beforeEach(function() {
      authenticationServiceMock = jasmine.createSpyObj('authenticationService', ['someAsyncCall']);
      module('MailzApp');

      inject(function($rootScope, $controller, $q, _$location_, _$timeout_) {
        $scope = $rootScope.$new();
        authenticationServiceMock.someAsyncCall.andReturn($q.when('whee'));
        $timeout = _$timeout_;
        $location = _$location_;
        ctrl = $controller('SignupCtrl', {
          $scope: $scope,
          $location: $location,
          authenticationService: authenticationServiceMock
        });
      });
    });

    it('should start with yourName empty', function() {
      expect($scope.yourName).toEqual('');
    });

    it('should start with email empty', function() {
      expect($scope.email).toEqual('');
    });

    it('should start with password empty', function() {
      expect($scope.password).toEqual('');
    });

    it('should start with verifyPassword empty', function() {
      expect($scope.verifyPassword).toEqual('');
    });
  });
})();
