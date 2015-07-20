'use strict';

var util = require('../util');


var IdSiteApp = function(){
  this.pageTitle = function(){
    return browser.getTitle();
  };
  this.logoImageUrl = function(){
    return element(by.css('.logo')).getAttribute('src');
  };
  this.arriveWithJwt = function arriveWithJwt(path,done){
    util.getJwtUrl(path,function(url){
      browser.get(url);
      done();
    });
  };
  this.clickRegistrationLink = function() {
    console.log('click');
    element(by.css('[wd-can-register]')).click();
  };
  this.waitForUrlChange = function() {

    var currentUrl;

    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        if(!currentUrl){
          currentUrl = url;
        }
        return currentUrl !== url;
      });
    }, 10000);

  };
};

module.exports = IdSiteApp;