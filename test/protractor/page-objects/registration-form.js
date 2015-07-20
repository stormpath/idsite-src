'use strict';

var util = require('../util');
var uuid = require('node-uuid');

var RegistrationForm = function(){
  var cssRoot = '.registration-form ';
  this.typeInField = function(field,value){
    return element(by.css(cssRoot+'input[name='+field+']')).sendKeys(value);
  };
  this.clearField = function(field){
    return element(by.css(cssRoot+'input[name='+field+']')).clear();
  };
  this.typeAndBlurPassword = function(v){
    this.clearField('password');
    this.typeInField('password',v);
    this.submit();
  };
  this.clearField = function(field){
    return element(by.css(cssRoot+'input[name='+field+']')).clear();
  };
  this.submit = function(){
    return element(by.css(cssRoot+'button')).submit();
  };
  this.isShowingInvalidEmail = function(){
    return element(by.css(cssRoot+'.group-email .validation-error')).isDisplayed();
  };
  this.isShowingDuplicateUser = function(){
    return element(by.css(cssRoot+'.duplicate-user')).isDisplayed();
  };
  this.isShowingPasswordError = function(error){
    return element(by.css('[wd-'+error+']')).isDisplayed();
  };
  this.isPresent = function(){
    return element(by.css('.registration-view')).isDisplayed();
  };
  this.submitIsDisabled = function() {
    return element(by.css('.registration-view button[type=submit]')).getAttribute('disabled');
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
  this.waitForSubmitResult = function(){
    var self = this;
    browser.driver.wait(function(){
      return self.submitIsDisabled().then(function(value) {
        return value === null;
      });
    },10000);
  };
  this.fillWithValidInformation = function(){
    this.typeInField('givenName','test');
    this.typeInField('surname','test');
    this.typeInField('email','nobody+'+uuid()+'@stormpath.com');
    this.typeInField('password','aaaaaaaaA1');
    this.typeInField('passwordConfirm','aaaaaaaaA1');
  };
  this.fillWithDuplicateUser = function(){
    this.fillWithValidInformation();
    this.clearField('email');
    this.typeInField('email',util.resources.loginAccount.email);
  };
  this.arriveWithPasswordRequirements =
    function arriveWithPasswordRequirements(){
      browser.get(
        browser.params.appUrl + '#register' + util.fakeAuthParams('1')
      );
    };
  this.arriveWithDiacriticRequirements =
    function arriveWithDiacriticRequirements(){
      browser.get(
        browser.params.appUrl + '#register' + util.fakeAuthParams('2')
      );
    };
};

module.exports = RegistrationForm;