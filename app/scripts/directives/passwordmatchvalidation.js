'use strict';

angular.module('stormpathIdpApp')
  .directive('passwordMatchValidation', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.validate = function(element){
          scope.validationError = (scope.fields.password.value !== '' && (element.val()!==scope.fields.password.value));
        };
      }
    };
  });
