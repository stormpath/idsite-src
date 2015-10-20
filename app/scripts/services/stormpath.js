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
        self.errors.push(error.status === 401 ? 'This link has expired' : msg);
      }
      setTimeout(function(){
        throw error;
      },1);
    }

    function ssoEndpointRedirect (serviceProviderCallbackUrl) {
      $window.location = client.baseurl + 'sso/?jwtResponse=' + serviceProviderCallbackUrl.split('jwtResponse=')[1];
    }

    function serviceProviderRedirect (serviceProviderCallbackUrl) {
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

    this.login = function login(data,cb){
      client.login(data,function(err,response){
        $rootScope.$apply(function(){
          if(err){
            if(err.serviceProviderCallbackUrl){
              serviceProviderRedirect(err.serviceProviderCallbackUrl);
            }else{
              cb(err);
            }
          }else{
            ssoEndpointRedirect(response.serviceProviderCallbackUrl);
          }
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
          }else if(response.serviceProviderCallbackUrl){
            ssoEndpointRedirect(response.serviceProviderCallbackUrl);
          }else{
            self.isRegistered = true;
            $location.path('/unverified');
          }
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
          cb(err);
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
