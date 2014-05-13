'use strict';

angular.module('stormpathIdpApp')
  .controller('VerifyCtrl', function ($scope, $location,Stormpath) {


    $scope.status = 'loading';

    var params = $location.search();

    Stormpath.init(function(){
      Stormpath.verifyEmailToken(params.sptoken,function(err){
        if(err){
          $scope.status='failed';
          $scope.error = err.userMessage || err;
        }else{
          $scope.status='verified';
        }
      });
    });
  });
