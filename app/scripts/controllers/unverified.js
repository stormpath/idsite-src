'use strict';

angular.module('stormpathIdpApp')
  .controller('UnverifiedCtrl', function ($scope,Stormpath,$location) {
    var a = Stormpath.registeredAccount;
    if(!a || a.status!=='UNVERIFIED'){
      $location.path('/');
    }
  });
