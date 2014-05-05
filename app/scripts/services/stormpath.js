'use strict';


angular.module('stormpathIdpApp')
  .service('Stormpath', function Stormpath($window,$routeParams,$location,$rootScope) {
    var stormpath = $window.Stormpath;
    var appConfig = null;
    var appConfigError = null;

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
            hasSocial: $routeParams.hasSocial === 'false' ? false : true
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
    this.Client = stormpath.Client;
  });
