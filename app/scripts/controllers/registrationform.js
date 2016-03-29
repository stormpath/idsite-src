'use strict';

angular.module('stormpathIdpApp')
  .controller('RegistrationFormCtrl', function ($scope,Stormpath) {

    $scope.fields = {};

    var accountFields = [
      'username',
      'email',
      'password',
      'givenName',
      'middleName',
      'surname',
      'status',
      'password',
      'customData'
    ];

    $scope.submit = function(){
      $scope.unknownError = false;
      var inError = Object.keys($scope.fields).filter(function(f){
        var field = $scope.fields[f];
        return field.validate();
      });
      var data = Object.keys($scope.fields).reduce(function(acc,field){
        var value = $scope.fields[field].value;
        if (accountFields.indexOf(field) === -1) {
          acc.customData[field] = value;
        }else{
          acc[field] = value;
        }
        return acc;
      },{customData: {}});
      delete data.customData.passwordConfirm;
      if(inError.length===0){
        $scope.submitting = true;
        Stormpath.register(data,function(err){
          $scope.submitting = false;
          if(err){
            if(err.status===409){
              $scope.fields.email.setError('duplicateUser', true);
            }else{
              $scope.unknownError = String(err.userMessage || err.developerMessage || err);
            }
          }
        });
      }
    };

  });
