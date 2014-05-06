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
          validate: function(){
            if(scope.validate){
              scope.validate(element);
            }
          }
        };

        element.on('input',function(){
          scope.$apply(function(scope){
            scope.fields[fieldname].value = element.val();
          });
        });
        scope.$watchCollection('fields.'+fieldname,function(a){
          element.val(a.value);
        });
      }
    };
  });
