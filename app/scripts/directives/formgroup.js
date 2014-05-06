'use strict';

angular.module('stormpathIdpApp')
  .directive('formGroup', function () {
    return {
      restrict: 'A',
      scope: true,
      link: function postLink(scope, element, attrs) {
        scope.validationError = false;
        scope.errors = {};
        scope.$watch('validationError',function(){
          element.toggleClass(attrs.errorClass||'has-error',scope.validationError);
        });
        scope.$watchCollection('errors',function(){
          var errorCount = Object.keys(scope.errors).filter(function(k){
            return scope.errors[k];
          }).length;
          element.toggleClass(attrs.errorClass||'has-error',scope.validationError || errorCount>0);
        });

      }
    };
  });
