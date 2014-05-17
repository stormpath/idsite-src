'use strict';

angular.module('stormpathIdpApp')
  .directive('passwordPolicyValidation', function (Stormpath) {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.errors = {
          minLength: false,
          maxLength: false,
          requireLowerCase: false,
          requireUpperCase: false,
          requireNumeric: false,
          requireDiacritical: false
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
            ['minLength' , function(){return v.length < Stormpath.siteModel.passwordPolicy.minLength;}],
            ['maxLength' , function(){ return v.length > Stormpath.siteModel.passwordPolicy.maxLength;}],
            ['requireLowerCase' , function(){ return Stormpath.siteModel.passwordPolicy.requireLowerCase && !(/[a-z]/).test(v);}],
            ['requireUpperCase' , function(){ return Stormpath.siteModel.passwordPolicy.requireUpperCase && !(/[A-Z]/).test(v);}],
            ['requireNumeric' , function(){ return Stormpath.siteModel.passwordPolicy.requireNumeric && !(/[0-9]/).test(v);}],
            ['requireDiacritical' , function(){ return Stormpath.siteModel.passwordPolicy.requireDiacritical && !(/[\u00C0-\u017F]/).test(v);}]
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
