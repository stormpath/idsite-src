'use strict';


angular.module('stormpathIdpApp')
  .service('Stormpath', function Stormpath($window,$routeParams,$location,$rootScope) {
    var stormpath = $window.Stormpath;
    var appConfig = null;
    var appConfigError = null;


    var client;
    var application;

    this.errors = [];

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
            logoUrl: '/images/logo.png',
            hasSocial: $routeParams.hasSocial === 'false' ? false : true,
            appHref: 'https://api.stormpath.com/v1/applications/1234'
          };
          // appConfigError = {message:'something went wrong!'};
          if(appConfigError){
            $rootScope.$apply(function(){
              $location.path('/error');
              cb(appConfigError);
            });
          }else{
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

      onready.push(cb);

      initializing = true;

      self.getAppConfig(function(err,appConfig){

        if(err){
          showError(err);
        }else{
          try{
            client = new stormpath.Client({
              appHref: appConfig.appHref,
              headers:{
                'User-Agent': $window.navigator.userAgent
              }
            });
          }catch(e){
            showError(err);
            return;
          }
          client.getApplication(appConfig.appHref,function(err,spApp){
            $rootScope.$apply(function(){
              if(err){
                showError(err);
              }else{
                application = spApp;
                initializing = false;
                initialized = true;
                onready.map(function(fn){
                  fn(null);
                });
              }
            });
          });
        }
      });
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

    return this;
  });
