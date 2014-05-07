'use strict';

angular.module('stormpathIdpApp')
  .controller('ForgotCtrl', function ($scope,Stormpath) {
    $scope.sent = false;
    $scope.submit = function(){
      $scope.notFound = false;
      Stormpath.sendPasswordResetEmail($scope.email,function(err,resp){
        if(err){
          if(err.status===404){
            $scope.notFound = true;
          }else{
            $scope.unknownError = err;
          }
        }else{
          // debugger
          $scope.sent = true;
        }
      });
    };
  });
