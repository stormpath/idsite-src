'use strict';

angular.module('stormpathIdpApp')
  .controller('LoginCtrl', function ($scope,Stormpath) {
    $scope.ready = false;
    Stormpath.getAppConfig(function(err,getAppConfig){
      if(err){
        return;
      }else{
        $scope.ready = true;
        $scope.hasSocial = getAppConfig.hasSocial;
      }
    });

    return $scope;
  });
