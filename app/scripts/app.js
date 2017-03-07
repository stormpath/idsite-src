'use strict';

(function(){

  angular
  .module('stormpathIdpApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: function(obj, requestedPath) {window.location.href="https://login.fashiontrade.com";}      
      })
      .when('/register', {
        templateUrl: 'views/registration.html',
        controller: 'RegistrationCtrl'
      })
      .when('/forgot/:retry?', {
        templateUrl: 'views/forgot.html',
        controller: 'ForgotCtrl'
      })
      .when('/reset', {
        templateUrl: 'views/reset.html',
        controller: 'ResetCtrl'
      })
      .when('/verify', {
        templateUrl: 'views/verify.html',
        controller: 'VerifyCtrl'
      })
      .when('/unverified', {
        templateUrl: 'views/unverified.html',
        controller: 'UnverifiedCtrl'
      })
      .when('/mfa/setup/:factor?', {
        templateUrl: 'views/mfa-setup.html',
        controller: 'MfaSetupCtrl'
      })
      .when('/mfa/verify/:factor?/:firstVerification?', {
        templateUrl: 'views/mfa-verify.html',
        controller: 'MfaVerifyCtrl'
      })
      .when('/mfa/redirect/:source?/:jwt?', {
        templateUrl: 'views/mfa-redirect.html',
        controller: 'MfaRedirectCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
})(window);
