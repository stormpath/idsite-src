'use strict';

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
      .when('/forgot', {
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
        templateUrl: 'views/unverified.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($routeParams,$location){
    function getParam(param,url) {
      var m = url.match(new RegExp(param + '=[^/&#]+','g'));
      return (m && m.length > 0) ? m[0].split('=')[1] : null;
    }

    if(getParam('emailVerificationToken',$location.absUrl())){
      $location.path('verify');
    }
    if(getParam('passwordResetToken',$location.absUrl())){
      $location.path('reset');
    }
  });


