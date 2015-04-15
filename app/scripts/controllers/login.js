'use strict';

angular.module('stormpathIdpApp')
  .controller('LoginCtrl', function ($scope,Stormpath,$window) {
    $scope.ready = false;
    $scope.canRegister = true;
    $scope.errors = {
      badLogin: false,
      notFound: false,
      userMessage: false,
      unknown: false,
      accountStoreRequired: false,
      accountStoreNotFound: false
    };

    var accountStoreMap;

    Stormpath.init.then(function initSuccess(){
      $scope.canRegister = !!Stormpath.idSiteModel.passwordPolicy;
      $scope.providers = Stormpath.providers;

      $scope.hasSocial = $scope.providers.length > 0;

      if(Stormpath.getProvider('facebook')){
        initFB();
      }
      Stormpath.getMultiTenantConfig().then(function(mtConfig){
        $scope.requireAccountStore = true;
        accountStoreMap = mtConfig.accountStores;

      }).finally(function(){
        $scope.ready = true;
      });
    });

    var googleIsSignedIn = false;

    function initFB(){
      $window.fbAsyncInit = function() {
        var FB = $window.FB;
        FB.init({
          appId: Stormpath.getProvider('facebook').clientId,
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

    function errHandler(err){
      if(err){
        showError(err);
      }
    }

    $scope.submit = function(){
      clearErrors();
      if(accountStoreMap){
        if($scope.accountStoreName){
          if(accountStoreMap[$scope.accountStoreName]){
            Stormpath.login({
              login: $scope.username.trim(),
              password: $scope.password.trim(),
              accountStore: {
                href: accountStoreMap[$scope.accountStoreName]
              }
            },errHandler);
          }else{
            $scope.errors.accountStoreNotFound = true;
          }
        }else{
          $scope.errors.accountStoreRequired = true;
        }
      }
      else if($scope.username && $scope.password){
        Stormpath.login({
          login: $scope.username.trim(),
          password: $scope.password.trim()
        },errHandler);
      }
    };

    $scope.googleLogin = function(){
      var gapi = $window.gapi;
      if(!gapi){
        return;
      }
      clearErrors();
      var params = {
        clientid: Stormpath.getProvider('google').clientId,
        scope: 'email',
        cookiepolicy: 'single_host_origin',
        callback: function(authResult){
          if (!googleIsSignedIn && authResult.status.signed_in) {
            googleIsSignedIn = true;
            Stormpath.register({
              providerData: {
                providerId: 'google',
                accessToken: authResult.access_token
              }
            },errHandler);
          }
        }
      };

      gapi.auth.signIn(params);
    };

    function fbRegister(response){
      Stormpath.register({
        providerData: {
          providerId: 'facebook',
          accessToken: response.authResponse.accessToken
        }
      },errHandler);
    }

    $scope.facebookLogin = function(){
      var FB = $window.FB;

      FB.login(function(response) {
        if(response.status === 'connected'){
          fbRegister(response);
        }
      },{scope: 'email'});

    };

    $scope.providerLogin = function(providerId){
      var fn = $scope[providerId+'Login'];
      if(typeof fn!=='function'){
        console.error('provider login function \'' + providerId + '\' is not implemented');
      }else{
        fn();
      }
    };

    return $scope;
  });
