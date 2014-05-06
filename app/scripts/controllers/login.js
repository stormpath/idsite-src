'use strict';

angular.module('stormpathIdpApp')
  .controller('LoginCtrl', function ($scope,Stormpath) {
    $scope.ready = false;

    Stormpath.getAppConfig(function(err,appConfig){
      if(err){
        return;
      }else{
        $scope.ready = true;
        $scope.hasSocial = appConfig.hasSocial;
      }
    });

    $scope.submit = function(){
      Stormpath.login($scope.username,$scope.password,function(err,resp){
        console.log('login response',err,resp);
        // do stuff with errors
        // or redirect back to service provider
      });
    };

    return $scope;
  });
