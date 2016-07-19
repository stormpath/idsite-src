'use strict';

angular.module('stormpathIdpApp')
  .controller('RegistrationFormCtrl', function ($scope,Stormpath) {

    function errorParser(errObject){
      var err = errObject || {};
      return String(err.message || err.userMessage || err.developerMessage || err);
    }

    $scope.fields = {};

    $scope.submit = function(){
      $scope.knownError = $scope.unknownError = false;
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
        $scope.submitting = true;
        Stormpath.register(data,function(err){
          $scope.submitting = false;
          if(err){
            if(err.status===409){
              $scope.fields.email.setError('duplicateUser', true);
            }else if (err.code){
              $scope.knownError = errorParser(err);
            }else{
              $scope.unknownError = errorParser(err);
            }
          }
        });
      }
    };

  });
