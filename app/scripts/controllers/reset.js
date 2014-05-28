'use strict';

angular.module('stormpathIdpApp')
  .controller('ResetCtrl', function ($scope,Stormpath,$location) {

    $scope.status = 'loading';

    $scope.fields = {};

    var account;

    Stormpath.init.then(function initSuccess(){
      Stormpath.verifyPasswordToken(Stormpath.sptoken,function(err,a){
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
          $scope.unknownError = String(err.userMessage || err.developerMessage || err);
        }else{
          $scope.status = 'success';
        }
      });
    };
  });
