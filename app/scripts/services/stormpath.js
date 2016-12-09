'use strict';


angular.module('stormpathIdpApp')
  .service('Stormpath', function Stormpath($window,$routeParams,$location,$rootScope,$q) {
    var self = this;
    var init = $q.defer();
    var params = $location.search();
    var stormpath = $window.Stormpath;
    var ieMatch = $window.navigator.userAgent.match(/MSIE ([0-9.]+)/);

    var client = self.client = null;
    self.init = init.promise;
    self.errors = [];
    self.jwt = params.jwt;
    self.isRegistered = null;
    self.providers = [];
    self.registeredAccount = null;
    self.isVerified = null;

    function showError(error){
      var msg = error.userMessage || error.developerMessage || error.message || 'Unknown';
      if(self.errors.indexOf(msg)===-1){
        self.errors.push(msg);
      }
    }

    function getJwtFromCallbackUri(uri) {
      return uri.split('jwtResponse=')[1];
    }

    function serviceProviderRedirect(serviceProviderCallbackUrl) {
      $window.location = serviceProviderCallbackUrl;
    }

    function initialize(){
      if(ieMatch && ieMatch[1]){
        if(parseInt(ieMatch[1],10)<10){
          showError(new Error('Internet Explorer ' + ieMatch[1] + ' is not supported.  Please try again with a newer browser.'));
          return;
        }
      }

      client = self.client = new stormpath.Client(function(err,idSiteModel){
        $rootScope.$apply(function(){
          if(err){
            showError(err);
            init.reject(err);
          }else{
            var m = idSiteModel;
            self.idSiteModel = m;
            self.providers = self.providers.concat(m.providers);
            $rootScope.logoUrl = m.logoUrl;
            init.resolve();
          }
        });
      });
    }

    this.ssoEndpointRedirect = function ssoEndpointRedirect(jwt) {
      $window.location = client.baseurl + 'sso/?jwtResponse=' + jwt;
    };

    this.ssoEndpointRedirectFromUrl = function ssoEndpointRedirectFromUrl(url) {
      var jwt = getJwtFromCallbackUri(url);
      self.ssoEndpointRedirect(jwt);
    };

    this.mfaRedirectFromCallbackUrl = function mfaRedirectFromCallbackUrl(source, url) {
      var jwt = getJwtFromCallbackUri(url);
      $location.path('/mfa/redirect/' + encodeURIComponent(source) + '/' + encodeURIComponent(jwt));
    };

    this.samlLogin = function samlLogin(accountStore, cb){
      var xhrRequest = {
        method: 'GET',
        url: self.client.appHref + '/saml/sso/idpRedirect?accountStore.href=' + accountStore.href
      };

      self.client.requestExecutor.execute(xhrRequest, function(err,response) {
        if(err){
          if(err.serviceProviderCallbackUrl){
            serviceProviderRedirect(err.serviceProviderCallbackUrl);
          }else{
            cb(err);
          }
        }else{
          $window.location = response.serviceProviderCallbackUrl;
        }
      });
    };

    this.getAccountFromSession = function getAccountFromSession() {
      var sessionJwt = client.getSessionJwt();

      // This should be set as body.sub, but for some reason isn't.
      // So because of that, hack it up by building our own account href.
      var accountScope = sessionJwt.body.scope.account;
      var accountId = Object.keys(accountScope)[0];
      var accountHref = client.baseurl + '/v1/accounts/' + accountId;

      return {
        href: accountHref
      };
    };

    this.login = function login(data,cb){
      var options = {};

      if (client.requireMfa) {
        options.redirect = false;
      }

      client.login(data, options, function (err, response) {
        $rootScope.$apply(function(){
          if(err){
            if(err.serviceProviderCallbackUrl){
              serviceProviderRedirect(err.serviceProviderCallbackUrl);
            }else{
              cb(err);
            }
            return;
          }

          if (response && response.serviceProviderCallbackUrl) {
            var callbackJwt = getJwtFromCallbackUri(response.serviceProviderCallbackUrl);
            return self.ssoEndpointRedirect(callbackJwt);
          }

          var sessionJwt = client.getSessionJwt();

          if (!sessionJwt) {
            return cb(new Error('Login failed. Did not receive a session JWT.'));
          }

          if (client.requireMfa) {
            var action = 'setup';

            // If we have factors, then redirect to verification.
            if (Object.keys(sessionJwt.body.scope.factor || {}).length > 0) {
              action = 'verify';
            }

            return $location.path('/mfa/' + action);
          }

          self.ssoEndpointRedirect(sessionJwt.toString());
        });
      });
    };

    this.register = function register(data,cb){
      client.register(data,function(err,response){
        $rootScope.$apply(function(){
          if(err){
            if(err.serviceProviderCallbackUrl){
              serviceProviderRedirect(err.serviceProviderCallbackUrl);
            }else{
              cb(err);
            }
            return;
          }

          var sessionJwt = client.getSessionJwt();

          if (sessionJwt && sessionJwt.body.require_mfa) {
            return $location.path('/mfa/setup/');
          }

          if(response && response.serviceProviderCallbackUrl){
            var jwt = getJwtFromCallbackUri(response.serviceProviderCallbackUrl);
            return self.ssoEndpointRedirect(jwt);
          }

          self.isRegistered = true;

          $location.path('/unverified');
        });
      });
    };

    this.verifyEmailToken = function verifyEmailToken(cb){
      client.verifyEmailToken(function(err){
        $rootScope.$apply(function(){
          self.isVerified = err ? false : true;
          cb(err);
        });
      });
    };

    this.verifyPasswordToken = function verifyPasswordToken(cb){
      client.verifyPasswordResetToken(function(err, resp) {
        $rootScope.$apply(function(){
          cb(err,resp);
        });
      });
    };

    this.sendPasswordResetEmail = function sendPasswordResetEmail(email,cb){
      client.sendPasswordResetEmail(email,function(err) {
        $rootScope.$apply(function(){
          if(err){
            if(err.serviceProviderCallbackUrl){
              serviceProviderRedirect(err.serviceProviderCallbackUrl);
            }else{
              cb(err);
            }
          }else{
            cb();
          }
        });
      });
    };

    this.setNewPassword = function setNewPassword(pwTokenVerification,newPassword,cb){
      client.setAccountPassword(pwTokenVerification,newPassword,function(err, resp) {
        $rootScope.$apply(function(){
          cb(err,resp);
        });
      });
    };

    this.getFactors = function getFactors(account, callback){
      client.getFactors(account, function (err, response) {
        $rootScope.$apply(function () {
          callback(err, response);
        });
      });
    };

    this.challengeFactor = function challengeFactor(factor, challenge, callback){
      client.challengeFactor(factor, challenge, function (err, response) {
        $rootScope.$apply(function () {
          callback(err, response);
        });
      });
    };

    this.createFactor = function createFactor(account, data, callback){
      client.createFactor(account, data, function (err, response) {
        $rootScope.$apply(function () {
          callback(err, response);
        });
      });
    };

    this.createChallenge = function createFactor(factor, data, callback){
      client.createChallenge(factor, data, function (err, response) {
        $rootScope.$apply(function () {
          callback(err, response);
        });
      });
    };

    this.updateChallenge = function createFactor(challenge, data, callback){
      client.updateChallenge(challenge, data, function (err, response) {
        $rootScope.$apply(function () {
          callback(err, response);
        });
      });
    };

    this.getOrganizationNameKey = function getOrganizationNameKey(){
      return client.jwtPayload.asnk || '';
    };

    this.getProvider = function getProvider(providerId){
      var r = self.providers.filter(function(p){
        return p.providerId === providerId;
      });
      return r.length === 1 ? r[0]:null;
    };

    initialize();

    return this;
  });
