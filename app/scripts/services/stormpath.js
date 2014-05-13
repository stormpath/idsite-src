'use strict';


angular.module('stormpathIdpApp')
  .service('Stormpath', function Stormpath($window,$routeParams,$location,$rootScope) {
    var params = $location.search();
    var stormpath = $window.Stormpath;
    var appConfig = null;
    var appConfigError = null;


    var client;
    var application;

    this.errors = [];

    this.accessToken = params.access_token;
    this.appHref = params.application_href;

    this.getAppConfig = function(cb){

      if(appConfigError){
        $location.path('/error');
        cb(appConfigError);
      }
      else if(appConfig){
        cb(appConfigError,appConfig);
      }else{
        setTimeout(function(){
          appConfig = {
            logoUrl: 'images/logo.png',
            hasSocial: $routeParams.hasSocial === 'false' ? false : true,
            appHref: 'https://api.stormpath.com/v1/applications/1234',
            googleClientId: '279686489820-bm1m1kd1dbdojvhmh4phhr6aofj95933.apps.googleusercontent.com',
            facebookAppId: '711511582223538'
          };
          // appConfigError = {message:'something went wrong!'};
          if(appConfigError){
            $rootScope.$apply(function(){
              $location.path('/error');
              cb(appConfigError);
            });
          }else{
            $rootScope.logoUrl = appConfig.logoUrl;
            $rootScope.$apply(function(){
              cb(null,appConfig);
            });
          }


        },200);
      }

    };
    var self = this;

    self.registeredAccount = null;
    self.verifiedAccount = null;

    function showError(error){
      self.errors.push(error.message || 'Unknown');
      $location.path('/error');
    }

    var initializing = false;
    var initialized = false;

    var onready = [];

    this.init = function(cb){
      if(initializing){
        onready.push(cb);
        return;
      }

      if(initialized){
        cb(null);
      }

      onready.push(typeof cb === 'function' ? cb : function(){});

      try{
        client = new stormpath.Client({
          authToken: self.accessToken
        });
      }catch(e){
        showError(e);
        return;
      }

      initializing = true;

      client.getApplication(
        self.appHref,
        {
          expand:'ssoConfig'
        },
        function(err,spApp){

          $rootScope.$apply(function(){
            if(err){
              showError(err);
            }else{
              application = spApp;
              initializing = false;
              initialized = true;
              self.ssoConfig = application.ssoConfig;
              onready.map(function(fn){
                fn(null);
              });
              onready = [];
            }
          });
        }
      );
    };

    this.login = function(username,password,cb){
      try{
        application.authenticateAccount({
          username: username,
          password: password
        },function(err,result){
          $rootScope.$apply(function(){
            cb(err,result);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.register = function(data,cb){
      try{
        application.createAccount(data,function(err,result){
          if(!err){
            self.registeredAccount = result;
          }
          $rootScope.$apply(function(){
            cb(err,result);
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
        client.getCurrentTenant(function(err, tenant) {
          if (err){
            throw err;
          }else{
            tenant.verifyAccountEmail(token,function(err,account){
              if(!err){
                self.verifiedAccount = account;
              }
              $rootScope.$apply(function(){
                cb(err,account);
              });
            });
          }
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
        application.createAccount(data,function(err,result){
          if(!err){
            self.registeredAccount = result;
          }
          $rootScope.$apply(function(){
            cb(err,result);
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
        application.createAccount(data,function(err,result){
          if(!err){
            self.registeredAccount = result;
          }
          $rootScope.$apply(function(){
            cb(err,result);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };

    this.nicePasswordErrors = {
      'Password requires a numeric character!': 'Password requires a number',
      'Password requires an uppercase character!': 'Password requires an uppercase letter',
      'Account password minimum length not satisfied.': 'Password is too short',
      'Password requires a lowercase character!': 'Password requires a lowercase letter'
    };

    self.init();

    return this;
  });
