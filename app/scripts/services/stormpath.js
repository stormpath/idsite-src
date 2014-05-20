'use strict';


angular.module('stormpathIdpApp')
  .service('Stormpath', function Stormpath($window,$routeParams,$location,$rootScope,$q) {
    var params = $location.search();
    var stormpath = $window.Stormpath;

    var client;
    var application;
    var jwtPayload;

    this.errors = [];

    this.jwt = params.jwt;
    this.appHref = params.application_href;
    this.registrationStatus = null;

    var self = this;

    self.registeredAccount = null;
    self.verifiedAccount = null;

    function showError(error){
      var msg = error.message || 'Unknown';
      if(self.errors.indexOf(msg)===-1){
        self.errors.push(msg);
      }
      setTimeout(function(){
        throw error;
      },1);
    }

    var ieMatch = $window.navigator.userAgent.match(/MSIE ([0-9.]+)/);
    if(ieMatch && ieMatch[1]){
      if(parseInt(ieMatch[1],10)<10){
        showError(new Error('Internet Explorer ' + ieMatch[1] + ' is not supported.  Please try again with a newer browser.'));
        return;
      }
    }


    if(!this.jwt){
      showError(new Error('JWT token not provided'));
      return;
    }

    try{
      jwtPayload = JSON.parse(stormpath.base64.decode(self.jwt.split('.')[1]));
      self.appHref = jwtPayload.app_href;
    }catch(e){
      showError(e);
      return;
    }


    if(!this.appHref){
      showError(new Error('Application href not provided'));
      return;
    }

    var init = $q.defer();

    function initialize(){

      try{
        client = new stormpath.Client({
          authToken: self.jwt
        });

        client.getApplication(
          self.appHref,
          {
            expand:'siteModel'
          },
          function(err,spApp){
            $rootScope.$apply(function(){
              if(err){
                showError(err);
              }else{
                application = spApp;
                self.siteModel = application.siteModel;
                $rootScope.logoUrl = application.siteModel.logoUrl;
                init.resolve();
              }
            });
          }
        );
      }catch(e){
        showError(e);
        return;
      }
    }

    this.init = init.promise;

    this.login = function(username,password,cb){
      try{
        application.authenticateAccount({
          username: username,
          password: password
        },function(err,account,response){
          $rootScope.$apply(function(){
            cb(err,account,response);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.register = function(data,cb){
      try{
        application.createAccount(data,function(err,account,response){
          if(!err){
            self.registrationStatus = response.statusCode;
            if(response.statusCode===204){
              self.serviceProviderRedirect(
                self.getRedirectUrlFromResponse(response)
              );
            }
            if(response.statusCode===202){
              $rootScope.$apply(function(){
                $location.path('/unverified');
              });
            }
          }
          $rootScope.$apply(function(){
            cb(err);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.verifyEmailToken = function(token,cb){
      if(self.verifiedAccount){
        cb(null,self.verifiedAccount);
        return;
      }
      try{
        var p = self.appHref.split('/');
        var uri = p[0] + '//' + p[2] + '/v1/accounts/emailVerificationTokens/' + token;
        client._dataStore.createResource(uri,function(err,resource,response){
          $rootScope.$apply(function(){
            cb(err,response);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.verifyPasswordToken = function(token,cb){
      try{
        application.verifyPasswordResetToken(token,function(err, account) {
          $rootScope.$apply(function(){
            cb(err,account);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.sendPasswordResetEmail = function(email,cb){
      try{
        application.sendPasswordResetEmail(email,function(err, resp) {
          $rootScope.$apply(function(){
            cb(err,resp);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.saveAccount = function(account,cb){
      try{
        account.save(function(err, account) {
          if(!err){
            self.verifiedAccount = account;
          }
          $rootScope.$apply(function(){
            cb(err,account);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.googleLogin = function(accessToken,cb){
      try{
        var data = {
          providerData: {
            providerId: 'google',
            code: accessToken
          }
        };
        application.createAccount(data,function(err,account,response){
          if(!err){
            self.registeredAccount = account;
          }
          $rootScope.$apply(function(){
            cb(err,account,response);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.facebookLogin = function(accessToken,cb){
      try{
        var data = {
          providerData: {
            providerId: 'facebook',
            code: accessToken
          }
        };
        application.createAccount(data,function(err,account,response){
          if(!err){
            self.registeredAccount = account;
          }
          $rootScope.$apply(function(){
            cb(err,account,response);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.getRedirectUrlFromResponse = function(xhrResponse){
      return xhrResponse.getResponseHeader('Stormpath-SSO-Redirect-Location');
    };

    this.serviceProviderRedirect = function(url){
      $window.location = url;
    };

    this.nicePasswordErrors = {
      'Password requires a numeric character!': 'Password requires a number',
      'Password requires an uppercase character!': 'Password requires an uppercase letter',
      'Account password minimum length not satisfied.': 'Password is too short',
      'Password requires a lowercase character!': 'Password requires a lowercase letter'
    };

    initialize();

    return this;
  });
