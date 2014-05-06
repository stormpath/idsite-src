'use strict';

angular.module('stormpathIdpApp')
  .directive('formControl', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var fieldname = attrs.name;
        if(!scope.fields){
          scope.fields = {};
        }
        scope.fields[fieldname] = {
          value: element.val(),
          validationError: false,
          errors: scope.errors || {},
          validate: function(){
            if(scope.validate){
              scope.validate(element);
              // scope.fields[fieldname].validationError = scope.validationError;
            }
          }
        };

        scope.clearErrors = function(){
          Object.keys(scope.errors).map(function(k){scope.errors[k]=false;});
        };

        element.on('input',function(){
          scope.$apply(function(scope){
            scope.fields[fieldname].value = element.val();
          });
        });
        scope.$watchCollection('fields.'+fieldname,function(a){
          element.val(a.value);
        });
        scope.$watchCollection('fields.'+fieldname+'.errors',function(a){
          angular.extend(scope.errors,a||{});
        });
      }
    };
  });
