'use strict';

angular.module('stormpathIdpApp')
  .controller('UnverifiedCtrl', function ($scope,Stormpath,$location) {
    if(Stormpath.registrationStatus!==202){
      $location.path('/');
    }
  });
