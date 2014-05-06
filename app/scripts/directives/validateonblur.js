'use strict';

angular.module('stormpathIdpApp')
  .directive('validateOnBlur', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        element.on('blur',function(){
          scope.$apply(function(){
            scope.validate(element);
          });
        });
      }
    };
  });
