'use strict';

angular.module('stormpathIdpApp')
  .controller('RegistrationFormCtrl', function ($scope) {
    $scope.fields = {};
    $scope.submit = function(){
      Object.keys($scope.fields).map(function(f){
        var field = $scope.fields[f];
        field.validate();
      });
    };
  });
