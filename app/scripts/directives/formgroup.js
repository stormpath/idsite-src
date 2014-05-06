'use strict';

angular.module('stormpathIdpApp')
  .directive('formGroup', function () {
    return {
      restrict: 'A',
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.validationError = false;
        scope.$watch('validationError',function(){
          element.toggleClass(attrs.errorClass||'has-error',scope.validationError);
        });
      }
    };
  });
