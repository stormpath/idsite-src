'use strict';

var LoginForm = function(){
  this.typeInField = function(field,value){
    return element(by.css('.login-form input[name='+field+']')).sendKeys(value);
  };
  this.submit = function(){
    return element(by.css('button')).submit();
  };
  this.isShowingInvalidLogin = function(){
    return element(by.css('.bad-login')).isDisplayed();
  };
  this.isShowingNotFound = function(){
    return element(by.css('.not-found')).isDisplayed();
  };
  this.isShowingRegistrationLink = function(){
    return element(by.css('[wd-can-register]')).isDisplayed();
  };
  this.hasFacebookButton = function(){
    return element(by.css('.btn-facebook')).isPresent();
  };
  this.hasGoogleButton = function(){
    return element(by.css('.btn-google')).isPresent();
  };
  this.hasSamlButton = function(){
    return element(by.css('.btn-saml')).isPresent();
  };
  this.isShowingProviderArea = function(){
    return element(by.css('.provider-area')).isDisplayed();
  };
  this.isShowingUsernameField = function(){
    return element(by.css('.login-form input[name=username]')).isDisplayed();
  };
  this.isPresent = function(){
    return element(by.css('.login-view')).isDisplayed();
  };
  this.submitIsDisabled = function() {
    return element(by.css('.login-view button[type=submit]')).getAttribute('disabled');
  };
  this.waitForForm = function(){
    /*
      TODO - implenet something in the stormpath.js client
      which keeps track of the "is waiting for a network request"
      state.  then, we can get rid of these wait functions and have
      a common "wait for client" function.
     */
    var self = this;
    return browser.driver.wait(function(){
      return self.isPresent();
    },10000);
  };
  this.waitForLoginAttempt = function(){
    var self = this;
    browser.driver.wait(function(){
      return self.submitIsDisabled().then(function(value) {
        return value === null;
      });
    },10000);
  };
  this.login = function(account){
    this.typeInField('username',account.email);
    this.typeInField('password',account.password);
    this.submit();
  };
};

module.exports = LoginForm;