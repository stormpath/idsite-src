'use strict';

angular.module('stormpathIdpApp')
  .controller('ResetCtrl', function ($scope,Stormpath,$location) {

    $scope.status = 'loading';

    $scope.fields = {};

    var params = $location.search();

    var account;

    Stormpath.init(function(){
      Stormpath.verifyPasswordToken(params.sptoken,function(err,a){
        if(err){
          if(err.status===404){
            $location.path('/forgot/retry');
          }else{
            $scope.status='failed';
            $scope.error = err.userMessage || err;
          }
        }else{
          $scope.status='verified';
          account = a;
        }
      });
    });
    $scope.submit = function(){
      var errorCount = Object.keys($scope.fields).filter(function(f){
        var field = $scope.fields[f];
        return field.validate();
      }).length;
      if(errorCount>0){
        return;
      }
      account.password = $scope.fields.password.value;
      Stormpath.saveAccount(account,function(err){
        if(err){
          var nicePasswordError = Stormpath.nicePasswordErrors[err.userMessage] ||
            Stormpath.nicePasswordErrors[err.developerMessage];
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
          $scope.status = 'success';
        }
      });
    };
  });
