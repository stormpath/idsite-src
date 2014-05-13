'use strict';

angular.module('stormpathIdpApp')
  .directive('passwordPolicyValidation', function (Stormpath) {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.errors = {
          minLength: false,
          maxLength: false,
          lowerCase: false,
          upperCase: false,
          digit: false,
          diacrit: false
        };
        scope.errorCount = function(){
          return Object.keys(scope.errors).filter(function(k){
            return scope.errors[k];
          }).length;
        };
        scope.validate = function(element){
          scope.clearErrors();
          var v = element.val();

          var tests =  [
            ['minLength' , function(){return v.length < Stormpath.ssoSite.password.minLength;}],
            ['maxLength' , function(){ return v.length > Stormpath.ssoSite.password.maxLength;}],
            ['lowerCase' , function(){ return Stormpath.ssoSite.password.lowerCase && !(/[a-z]/).test(v);}],
            ['upperCase' , function(){ return Stormpath.ssoSite.password.upperCase && !(/[A-Z]/).test(v);}],
            ['digit' , function(){ return Stormpath.ssoSite.password.upperCase && !(/[0-9]/).test(v);}],
            ['diacrit' , function(){ return Stormpath.ssoSite.password.diacrit && !(/^[A-Za-z\u00C0-\u017F]+$/).test(v);}]
          ];

          for(var i=0;i<tests.length;i++){
            scope.errors[tests[i][0]] = tests[i][1](v);
            if(scope.errorCount()>0){
              break;
            }
          }

          scope.validationError = scope.errorCount() > 0 ;
          return scope.validationError;
        };
      }
    };
  });
