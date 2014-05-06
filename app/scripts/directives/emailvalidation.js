'use strict';

angular.module('stormpathIdpApp')
  .directive('emailValidation', function () {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.validate = function(element){
          scope.clearErrors();
          var t = element.val()==='' ? true : (!re.test(element.val()));
          scope.validationError = t;
          return t;
        };
      }
    };
  });
