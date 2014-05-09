'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

var ResetPasswordView = function(){
  var cssRoot = '.reset-view ';
  this.typeInField = function(field,value){
    return element(by.css(cssRoot+'input[name='+field+']')).sendKeys(value);
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

};


describe('Reset password view', function() {


  describe('with a valid token', function() {
    var view = new ResetPasswordView();
    before(function(){
      browser.get(browser.params.appUrl + '?passwordResetToken=1#/reset');
      browser.sleep(3000);
    });
    it('should show me the reset password form', function() {
      expect(view.formIsVisible()).to.eventually.equal(true);
    });

    it('should warn me if I enter mismatched passwords', function() {
      view.fillWithMismatchedPasswords();
      view.submit();
      browser.sleep(100);
      expect(view.isShowingMismatchedPasswords()).to.eventually.equal(true);
    });

    it('should show me success if I enter good passwords',function(){
      view.clearForm();
      view.fillWithValidPasswords();
      view.submit();
      browser.sleep(3000);
      expect(view.isShowingSuccess()).to.eventually.equal(true);
    });
  });

  describe('with an invalid token', function() {
    before(function(){
      browser.get(browser.params.appUrl + '?passwordResetToken=2#/reset');
      browser.sleep(3000);
    });
    it('should send me to #/forgot/retry', function() {
      util.getCurrentUrl(function(url){
        expect(url).to.have.string('#/forgot/retry');
      });
    });
  });

});