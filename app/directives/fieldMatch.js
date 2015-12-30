'use strict';

/* global define */

define(
  [
    'app'
  ],

  function(app) {
    app.register.directive('fieldMatch', function() {
      return {
        restrict: 'A',
        scope: true,
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
          var checkFieldMatch = function() {
            var fieldMatch = scope.$eval(attrs.fieldMatch);
            var value = ngModel.$modelValue || ngModel.$viewValue;

            if (fieldMatch || value) {
              return fieldMatch === value;
            }

            return true;
          };

          scope.$watch(checkFieldMatch, function(n) {
            ngModel.$setValidity('fieldmatch', n);
          });
        }
      };
    });
  });
