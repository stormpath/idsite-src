'use strict';

angular.module('stormpathIdpApp')
  .controller('VerifyCtrl', function ($scope, $location,Stormpath,$timeout) {

    $scope.status = 'loading';

    var params = $location.search();

    Stormpath.init(function(){
      Stormpath.verifyEmailToken(params.sptoken,function(err,response){
        if(err){
          $scope.status='failed';
          $scope.error = err.userMessage || err;
        }else{
          var r = Stormpath.getRedirectUrlFromResponse(response);
          $scope.status='verified';
          $scope.redirectUrl = r;
          $timeout(function(){
            Stormpath.serviceProviderRedirect(r);
          },2000);
        }
      });
    });
  });
