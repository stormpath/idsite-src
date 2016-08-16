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
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function(Stormpath, $window){
    /**
     * This error handler will redirect the user to the specified
     * URL, if the arrive on ID Site without a session, e.g. they
     * bookmarked the page, and are not coming to it via the
     * service provider.  In this example, I redirect the user back
     * to the /login endpoint on my service provider, which will
     * issue a new redirect to ID Site, creating a new session.
     */
    Stormpath.init.catch(function(err){
      var redirectUrl = 'http://localhost:3000/login';
      if(err.message === 'Login session not initialized.') {
        Stormpath.errors.splice(0,Stormpath.errors.length);
        $window.location.replace(redirectUrl);
      }
    });
  });
})(window);