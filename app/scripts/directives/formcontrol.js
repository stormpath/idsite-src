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
          setError: function(k,v){
            if(typeof scope.setError === 'function'){
              scope.setError(k,v);
            }
          },
          validate: function(){
            return typeof scope.validate === 'function' ? scope.validate(element) : true;
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
        scope.$watchCollection('errors',function(a){
          angular.extend(scope.fields[fieldname].errors,a||{});
        });
        scope.$watchCollection('fields.'+fieldname+'.errors',function(a){
          angular.extend(scope.errors,a||{});
        });
      }
    };
  });
