'use strict';

angular.module('stormpathIdpApp')
  .directive('nameValidation', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.validate = function(element){
          scope.clearErrors();
          var t = element.val() === '';
          scope.validationError = t;
          return t;
        };
      }
    };
  });
