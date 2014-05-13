'use strict';

angular.module('stormpathIdpApp')
  .controller('LoginCtrl', function ($scope,Stormpath,$window) {
    $scope.ready = false;
    $scope.errors = {
      badLogin: false,
      notFound: false,
      userMessage: false,
      unknown: false,
      googleReject: false,
      facebookReject: false
    };

    var appConfig;

    Stormpath.init(function(err){
      if(err){
        return;
      }else{
        appConfig = Stormpath.ssoConfig;
        $scope.ready = true;
        $scope.hasSocial = appConfig.googleClientId || appConfig.facebookAppId;
        if(appConfig.facebookAppId){
          initFB();
        }
      }
    });

    function initFB(){
      $window.fbAsyncInit = function() {
        var FB = $window.FB;
        FB.init({
          appId: appConfig.facebookAppId,
          xfbml: true,
          status: true,
          version: 'v2.0'
        });
      };
      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = '//connect.facebook.net/es_LA/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }($window.document, 'script', 'facebook-jssdk'));
    }

    if(Stormpath.verifiedAccount){
      $scope.username = Stormpath.verifiedAccount.email;
    }

    function clearErrors(){
      Object.keys($scope.errors).map(function(k){$scope.errors[k]=false;});
    }

    function showError(err){
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
    }

    function errOrRedirect(err,resp){
      if(err){
        showError(err);
      }else{
        redirect(resp.redirectTo);
      }
    }

    function redirect(url){
      $window.location=url;
    }

    $scope.submit = function(){
      clearErrors();
      if($scope.username && $scope.password){
        Stormpath.login($scope.username,$scope.password,errOrRedirect);
      }
    };

    $scope.googleLogin = function(){
      var gapi = $window.gapi;
      if(!gapi){
        return;
      }
      clearErrors();
      var params = {
        clientid: appConfig.googleClientId,
        scope: 'https://www.googleapis.com/auth/plus.profile.emails.read',
        cookiepolicy: 'single_host_origin',
        callback: function(authResult){
          if (authResult.status.signed_in) {
            Stormpath.googleLogin(authResult.access_token,errOrRedirect);
          } else {
            if(authResult.error==='access_denied'){
              $scope.errors.googleReject = true;
            }
          }
        }
      };

      gapi.auth.signIn(params);
    };

    $scope.facebookLogin = function(){
      var FB = $window.FB;

      FB.getLoginStatus(function(response) {
        if(response.status === 'connected'){
          Stormpath.facebookLogin(response.authResponse.accessToken,errOrRedirect);
        }else{
          FB.login(function(response) {
            if(response.status === 'connected'){
              Stormpath.facebookLogin(response.authResponse.accessToken,errOrRedirect);
            }
          });
        }
      });

    };

    return $scope;
  });
