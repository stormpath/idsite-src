'use strict';

(function(){

  angular
  .module('stormpathIdpApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
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
      .when('/mfa/verify/:factor?', {
        templateUrl: 'views/mfa-verify.html',
        controller: 'MfaVerifyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
})(window);
