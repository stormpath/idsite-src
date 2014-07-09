'use strict';

angular.module('stormpathIdpApp')
  .controller('UnverifiedCtrl', function ($scope,Stormpath,$location) {
    if(!Stormpath.isRegistered){
      $location.path('/');
    }
  });
