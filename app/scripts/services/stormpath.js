'use strict';

angular.module('stormpathIdpApp')
  .service('Stormpath', function Stormpath() {
    var appConfig = null;
    this.getAppConfig = function(cb){
      if(appConfig){
        cb(null,appConfig);
      }else{
        // TODO use stormpath.js
        appConfig = {
          logoUrl: '/images/logo.png'
        };
        cb(null,appConfig);
      }
    };
  });
