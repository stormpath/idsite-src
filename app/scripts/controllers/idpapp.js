'use strict';

angular.module('stormpathIdpApp')
  .controller('IdpAppCtrl', function ($scope,Stormpath) {
    $scope.error = '';
    Stormpath.getAppConfig(function(err,config){
      if(err){
        $scope.error = err.message;
      }else{
        $scope.logoUrl = config.logoUrl;
      }
    });
  });
