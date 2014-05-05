'use strict';

angular.module('stormpathIdpApp')
  .controller('ErrorCtrl', function ($scope,Stormpath,$location) {
    Stormpath.getAppConfig(function(err){
      if(err){
        $scope.error = err.message;
      }else{
        $location.path('/');
      }
    });
  });
