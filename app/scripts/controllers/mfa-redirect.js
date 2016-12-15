'use strict';

angular.module('stormpathIdpApp')
  .controller('MfaRedirectCtrl', function ($scope, $routeParams, Stormpath) {
    $scope.source = $routeParams.source;
    $scope.jwt = $routeParams.jwt;

    function redirectWithJwt() {
      Stormpath.ssoEndpointRedirect($scope.jwt);
    }

    setTimeout(redirectWithJwt, 1000 * 3);
  });
