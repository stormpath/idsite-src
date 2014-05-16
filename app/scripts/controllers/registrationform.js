'use strict';

angular.module('stormpathIdpApp')
  .controller('RegistrationFormCtrl', function ($scope,Stormpath,$location,$window) {

    function afterRegistration(account,response){
      if(account && account.status==='UNVERIFIED'){
        $location.path('/unverified');
      }else{
        $window.location.replace(response.getResponseHeader('Stormpath-SSO-Redirect-Location'));
      }
    }

    if(Stormpath.registeredAccount){
      afterRegistration(Stormpath.registeredAccount);
    }

    $scope.fields = {};

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
        Stormpath.register(data,function(err,account,response){

          if(err){
            var nicePasswordError = Stormpath.nicePasswordErrors[err.userMessage] ||
              Stormpath.nicePasswordErrors[err.developerMessage];
            if(err.status===409){
              $scope.fields.email.setError('duplicateUser', true);
            }else if(nicePasswordError){
              $scope.fields.password.errors.passwordPolicy = nicePasswordError;
            }else if(err.userMessage && err.userMessage.toLowerCase().match(/password|account/)){
              $scope.fields.password.errors.passwordPolicy = err.userMessage;
            }else{
              $scope.unknownError = err;
            }
          }else{
            afterRegistration(account,response);
          }
        });
      }
    };

  });
