'use strict';

angular.module('stormpathIdpApp')
  .controller('RegistrationFormCtrl', function ($scope,Stormpath,$location,$window) {

    function afterRegistration(account){
      if(account.status==='UNVERIFIED'){
        $location.path('/unverified');
      }else{
        $window.location.replace(account.redirectTo);
      }
    }

    if(Stormpath.registeredAccount){
      afterRegistration(Stormpath.registeredAccount);
    }

    $scope.fields = {};

    var nicePasswordErrors = {
      'Password requires a numeric character!': 'Password requires a number',
      'Password requires an uppercase character!': 'Password requires an uppercase letter',
      'Account password minimum length not satisfied.': 'Password is too short',
      'Password requires a lowercase character!': 'Password requires a lowercase letter'
    };
    $scope.submit = function(){
      $scope.unknownError = false;
      var inError = Object.keys($scope.fields).filter(function(f){
        var field = $scope.fields[f];
        return field.validate();
      });
      var data = Object.keys($scope.fields).reduce(function(acc,f){
        acc[f] = $scope.fields[f].value;
        return acc;
      },{});
      delete data.passwordConfirm;
      if(inError.length===0){
        Stormpath.register(data,function(err,account){

          if(err){
            var nicePasswordError = nicePasswordErrors[err.userMessage] || nicePasswordErrors[err.developerMessage];
            if(err.status===409){
              $scope.fields.username.errors.duplicateUser = true;
            }else if(nicePasswordError){
              $scope.fields.password.errors.passwordPolicy = nicePasswordError;
            }else if(err.userMessage && err.userMessage.toLowerCase().match(/password|account/)){
              $scope.fields.password.errors.passwordPolicy = err.userMessage;
            }else{
              $scope.unknownError = err;
            }
          }else{
            afterRegistration(account);
          }
        });
      }
    };

  });
