'use strict';

angular.module('stormpathIdpApp')
  .directive('passwordMatchValidation', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.validate = function(element){
          var t = (scope.fields.password.value !== '' && (element.val()!==scope.fields.password.value));
          scope.validationError = t;
          return t;
        };
      }
    };
  });
