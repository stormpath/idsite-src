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
      // Stormpath.js needs some time to load the ID Site model
      browser.sleep(2000).then(done);
    });
  };
  this.clickRegistrationLink = function() {
    console.log('click');
    element(by.css('[wd-can-register]')).click();
  };
  this.waitForUrlChange = function() {

    var currentUrl;

    return browser.driver.getCurrentUrl().then(function storeCurrentUrl(url) {
      currentUrl = url;
    }).then(function waitForUrlToChangeTo() {
      return browser.wait(function waitForUrlToChangeTo() {
        return browser.driver.getCurrentUrl().then(function compareCurrentUrl(url) {
          return url !== currentUrl;
        });
      });
    });

  };
};

module.exports = IdSiteApp;