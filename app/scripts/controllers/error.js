'use strict';

angular.module('stormpathIdpApp')
  .controller('ErrorCtrl', function ($scope,Stormpath,$location) {
    $scope.errors = angular.copy(Stormpath.errors);
    if($scope.errors.length===0){
      $location.path('/');
    }else{
      Stormpath.errors = [];
    }
  });
