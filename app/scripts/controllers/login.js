'use strict';

angular.module('stormpathIdpApp')
  .controller('LoginCtrl', function ($scope,Stormpath) {
    $scope.ready = false;
    $scope.errors = {
      badLogin: false,
      notFound: false,
      userMessage: false,
      unknown: false
    };

    Stormpath.getAppConfig(function(err,appConfig){
      if(err){
        return;
      }else{
        $scope.ready = true;
        $scope.hasSocial = appConfig.hasSocial;
      }
    });

    function clearErrors(){
      Object.keys($scope.errors).map(function(k){$scope.errors[k]=false;});
    }

    $scope.submit = function(){
      Stormpath.login($scope.username,$scope.password,function(err,resp){
        console.log('login response',err,resp);
        clearErrors();
        if(err){
          if(err.status===400){
            $scope.errors.badLogin = true;
          }
          else if(err.status===404){
            $scope.errors.notFound = true;
          }
          else if(err.userMessage || err.message){
            $scope.errors.userMessage = err.userMessage || err.message;
          }else{
            $scope.errors.unknown = true;
          }
        }else{
          // or redirect back to service provider
        }
      });
    };

    return $scope;
  });
