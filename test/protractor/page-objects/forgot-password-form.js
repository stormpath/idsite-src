'use strict';

var util = require('../util');

var SubmitForm = require('./submit-form');

var ForgotPasswordForm = function(){
  this.cssRoot = '.forgot-view ';
  SubmitForm.call(this);
  return this;
};


ForgotPasswordForm.prototype.typeInField = function(field,value){
  return element(by.css(this.cssRoot+'input[name='+field+']')).sendKeys(value);
};
ForgotPasswordForm.prototype.clearField = function(field){
  return element(by.css(this.cssRoot+'input[name='+field+']')).clear();
};
ForgotPasswordForm.prototype.isShowingSuccess = function(){
  return element(by.css(this.cssRoot+'.wd-sent')).isDisplayed();
};
ForgotPasswordForm.prototype.isShowingBackToLogin = function(){
  return element(by.css('[wd-back-to-login]')).isDisplayed();
};
ForgotPasswordForm.prototype.isShowingInvalidEmail = function(){
  return element(by.css(this.cssRoot+'.wd-invalid-email')).isDisplayed();
};
ForgotPasswordForm.prototype.isShowingUserNotFound = function(){
  return element(by.css(this.cssRoot+'.wd-not-found')).isDisplayed();
};
ForgotPasswordForm.prototype.fillWithInvalidEmail = function(){
  this.typeInField('email','123');
};
ForgotPasswordForm.prototype.fillWithValidEmail = function(){
  this.typeInField('email','robert@stormpath.com');
};
ForgotPasswordForm.prototype.fillWithEmailAndWhitespaceAtFront = function(){
  this.typeInField('email', ' robert@stormpath.com');
};
ForgotPasswordForm.prototype.arrive = function(){
  browser.get(
    browser.params.appUrl + '#/forgot' + util.fakeAuthParams('1')
  );
};
ForgotPasswordForm.prototype.pressBackButton = function pressBackButton(){
  browser.navigate('/');
};
ForgotPasswordForm.prototype.isPresent = function(){
  return element(by.css(this.cssRoot)).isDisplayed();
};
ForgotPasswordForm.prototype.waitForForm = function(){
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

module.exports = ForgotPasswordForm;