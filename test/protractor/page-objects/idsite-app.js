'use strict';

var util = require('../util');


var IdSiteApp = function(){
  this.pageTitle = function(){
    return browser.getTitle();
  };
  this.logoImageUrl = function(){
    return element(by.css('.logo')).getAttribute('src');
  };
  this.arriveWithJwt = function arriveWithJwt(done){
    util.getJwtUrl(function(url){
      browser.get(url);
      done();
    });
  };

};

module.exports = IdSiteApp;