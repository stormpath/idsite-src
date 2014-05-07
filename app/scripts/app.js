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
      .when('/error', {
        templateUrl: 'views/error.html',
        controller: 'ErrorCtrl'
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
        templateUrl: 'views/unverified.html',
        controller: 'UnverifiedCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($routeParams,$location,Stormpath){
    function getParam(param,url) {
      var m = url.match(new RegExp(param + '=[^/&#]+','g'));
      return (m && m.length > 0) ? m[0].split('=')[1] : null;
    }

    Stormpath.init(function(err){
      if(err){
        $location.path('/error');
      }else if(getParam('emailVerificationToken',$location.absUrl())){
        $location.path('verify');
      }else if(getParam('passwordResetToken',$location.absUrl())){
        $location.path('reset');
      }
    });
  });
