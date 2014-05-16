'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

var ResetPasswordPageObject = function(){
  var cssRoot = '.reset-view ';
  this.typeInField = function(field,value){
    return element(by.css(cssRoot+'input[name='+field+']')).sendKeys(value);
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
  this.isShowingSuccess = function(){
    return element(by.css(cssRoot+'[wd-success]')).isDisplayed();
  };
  this.formIsVisible = function(){
    return element(by.css(cssRoot+'.reset-form')).isDisplayed();
  };
  this.isShowingMismatchedPasswords = function(){
    return element(by.css(cssRoot+'[wd-pw-mismatch]')).isDisplayed();
  };
  this.isShowingUserNotFound = function(){
    return element(by.css(cssRoot+'.wd-not-found')).isDisplayed();
  };
  this.isShowingPasswordError = function(error){
    return element(by.css('[wd-'+error+']')).isDisplayed();
  };
  this.fillWithMismatchedPasswords = function(){
    this.typeInField('password','123');
    this.typeInField('passwordConfirm','1');
  };
  this.fillWithValidPasswords = function(){
    this.typeInField('password','abC123');
    this.typeInField('passwordConfirm','abC123');
  };
  this.clearForm = function(){
    this.clearField('password');
    this.clearField('passwordConfirm');
  };
  this.arriveWithValidToken = function arriveWithValidToken(){
    browser.get(
        browser.params.appUrl + '#/reset' + util.fakeAuthParams() + '&sptoken=avalidtoken'
    );
  };
  this.arriveWithInvalidToken = function arriveWithInvalidToken(){
    browser.get(
        browser.params.appUrl + '#/reset' + util.fakeAuthParams() + '&sptoken=notvalidtoken'
    );
  };
};


describe('Reset password view', function() {

  var pageObj = new ResetPasswordPageObject();

  describe('with a valid token', function() {

    before(function(){
      pageObj.arriveWithValidToken();
    });
    it('should show me the reset password form', function() {
      expect(pageObj.formIsVisible()).to.eventually.equal(true);
    });

  });

  require('./suite/password')(function(){
    before(function(){
      pageObj.arriveWithValidToken();
    });
  },ResetPasswordPageObject);

  describe('with an invalid token', function() {
    before(function(){
      pageObj.arriveWithInvalidToken();
    });
    it('should send me to #/forgot/retry', function() {
      util.getCurrentUrl(function(url){
        expect(url).to.have.string('#/forgot/retry');
      });
    });
  });

});