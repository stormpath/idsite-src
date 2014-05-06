'use strict';

angular.module('stormpathIdpApp')
  .directive('nameValidation', function () {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.validate = function(element){
          scope.validationError = element.val() === '';
        };
      }
    };
  });
