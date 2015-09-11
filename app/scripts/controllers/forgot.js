'use strict';

angular.module('stormpathIdpApp')
  .controller('ForgotCtrl', function ($scope,Stormpath,$routeParams,$rootScope) {
    $scope.sent = false;
    $scope.ready = false;
    $scope.retry = $routeParams.retry || false;
    $scope.fields = {};
    $rootScope.$on('$locationChangeStart',function(e){
      if($scope.sent){
        e.preventDefault();
      }
    });
    Stormpath.init.then(function initSuccess(){
      $scope.organizationNameKey = Stormpath.client.jwtPayload.asnk || '';
      $scope.showOrganizationField = Stormpath.client.jwtPayload.sof;
      $scope.disableOrganizationField = $scope.organizationNameKey !== '';
      $scope.ready = true;
    });
    $scope.submit = function(){
      $scope.notFound = false;
      var inError = Object.keys($scope.fields).filter(function(f){
        return $scope.fields[f].validate();
      });
      if(inError.length>0){
        return;
      }
      var data = {
        email: $scope.fields.email.value.trim()
      };
      if($scope.organizationNameKey){
        data.accountStore = {
          nameKey: $scope.organizationNameKey
        };
      }
      if(Stormpath.client.jwtPayload.ash){
        data.accountStore = {
          href: Stormpath.client.jwtPayload.ash
        };
      }
      Stormpath.sendPasswordResetEmail(data,function(){
        $scope.sent = true;
      });
    };
  });
