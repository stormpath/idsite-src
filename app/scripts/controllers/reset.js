'use strict';

angular.module('stormpathIdpApp')
  .controller('ResetCtrl', function ($scope,Stormpath,$location) {
    function getParam(param,url) {
      var m = url.match(new RegExp(param + '=[^/&#]+','g'));
      return (m && m.length > 0) ? m[0].split('=')[1] : null;
    }
    $scope.status = 'loading';

    var token = getParam('passwordResetToken',$location.absUrl());

    Stormpath.init(function(){
      // debugger
      Stormpath.verifyPasswordToken(token,function(err){
        if(err){
          if(err.status===404){
            $scope.status='expired';
          }else{
            $scope.status='failed';
            $scope.error = err.userMessage || err;
          }
        }else{
          $scope.status='verified';
        }
      });
    });
  });
