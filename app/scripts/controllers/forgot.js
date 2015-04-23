'use strict';

angular.module('stormpathIdpApp')
  .controller('ForgotCtrl', function ($scope,Stormpath,$routeParams,$rootScope) {
    $scope.sent = false;
    $scope.retry = $routeParams.retry || false;
    $scope.fields = {};
    $rootScope.$on('$locationChangeStart',function(e){
      if($scope.sent){
        e.preventDefault();
      }
    });
    $scope.submit = function(){
      $scope.notFound = false;
      var inError = Object.keys($scope.fields).filter(function(f){
        return $scope.fields[f].validate();
      });
      if(inError.length>0){
        return;
      }
      Stormpath.sendPasswordResetEmail($scope.fields.email.value.trim(),function(){
        $scope.sent = true;
      });
    };
  });
