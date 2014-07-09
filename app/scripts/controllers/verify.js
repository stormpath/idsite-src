'use strict';

angular.module('stormpathIdpApp')
  .controller('VerifyCtrl', function ($scope, Stormpath) {

    $scope.status = 'loading';

    Stormpath.init.then(function initSuccess(){
      Stormpath.verifyEmailToken(function(err){
        if(err){
          $scope.status='failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
        }else{
          $scope.status='verified';
        }
      });
    });
  });
