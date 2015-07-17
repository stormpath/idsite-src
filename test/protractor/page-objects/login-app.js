'use strict';

var util = require('../util');


var LoginApp = function(){
  this.pageTitle = function(){
    return browser.getTitle();
  };
  this.logoImageUrl = function(){
    return element(by.css('.logo')).getAttribute('src');
  };
  this.arriveWithFacebookAndGoogleIntegrations = function arriveWithFacebookAndGoogleIntegrations(done){
    util.getJwtUrl(function(url){
      browser.get(url);
      done();
    });
  };
  this.arriveWithNoSocialIntegrations = function arriveWithNoSocialIntegrations(){
    browser.get(
      browser.params.appUrl + '#' + util.fakeAuthParams('2')
    );
  };
  this.arriveWithOnlyFacebookIntegration = function arriveWithOnlyFacebookIntegration(){
    browser.get(
      browser.params.appUrl + '#' + util.fakeAuthParams('3')
    );
  };
  this.arriveWithOnlyGoogleIntegration = function arriveWithOnlyGoogleIntegration(){
    browser.get(
      browser.params.appUrl + '#' + util.fakeAuthParams('4')
    );
  };
  this.arriveWithoutDefaultAccountStore = function arriveWithoutDefaultAccountStore(){
    browser.get(
      browser.params.appUrl + '#' + util.fakeAuthParams('5')
    );
  };

};

module.exports = LoginApp;