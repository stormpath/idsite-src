'use strict';

angular.module('stormpathIdpApp')
  .controller('VerifyCtrl', function ($scope, $location,Stormpath) {

    $scope.status = 'loading';

    var params = $location.search();

    Stormpath.init.then(function initSuccess(){
      Stormpath.verifyEmailToken(params.sptoken,function(err){
        if(err){
          $scope.status='failed';
          $scope.error = String(err.userMessage || err.developerMessage || err.message || err);
        }else{
          $scope.status='verified';
        }
      });
    });
  });
