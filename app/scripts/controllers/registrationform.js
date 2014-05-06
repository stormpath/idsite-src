'use strict';

angular.module('stormpathIdpApp')
  .controller('RegistrationFormCtrl', function ($scope,Stormpath) {
    $scope.fields = {};
    $scope.submit = function(){
      var inError = Object.keys($scope.fields).filter(function(f){
        var field = $scope.fields[f];
        return field.validate();
      });
      var data = Object.keys($scope.fields).reduce(function(acc,f){
        acc[f] = $scope.fields[f].value;
        return acc;
      },{});
      delete data.passwordConfirm;
      if(inError.length===0){
        Stormpath.register(data,function(err,resp){
          console.log(err,resp);
          if(err){
            if(err.status===409){
              $scope.fields.username.errors.duplicateUser = true;
            }
          }
        });
      }
    };
  });
