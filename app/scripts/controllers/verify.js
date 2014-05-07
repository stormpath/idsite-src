'use strict';



angular.module('stormpathIdpApp')
  .controller('VerifyCtrl', function ($scope, $location,Stormpath) {

    function getParam(param,url) {
      var m = url.match(new RegExp(param + '=[^/&#]+','g'));
      return (m && m.length > 0) ? m[0].split('=')[1] : null;
    }
    $scope.status = 'loading';

    var token = getParam('emailVerificationToken',$location.absUrl());

    Stormpath.init(function(){
      Stormpath.verifyEmailToken(token,function(err){
        if(err){
          $scope.status='failed';
          $scope.error = err.userMessage || err;
        }else{
          $scope.status='verified';
        }
      });
    });

    return $scope;
  });
