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

    function showError(error){
      self.errors.push(error.message || 'Unknown');
      $location.path('/error');
    }
    this.init = function(cb){

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
                cb(null);
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
          $rootScope.$apply(function(){
            cb(err,result);
          });
        });
      }
      catch(e){
        showError(e);
      }
    };
    this.Client = stormpath.Client;
    return this;
  });
