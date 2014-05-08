'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var ForgotPasswordView = function(){
  var cssRoot = '.forgot-view ';
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
    return element(by.css(cssRoot+'.wd-sent')).isDisplayed();
  };
  this.isShowingInvalidEmail = function(){
    return element(by.css(cssRoot+'.wd-invalid-email')).isDisplayed();
  };
  this.isShowingUserNotFound = function(){
    return element(by.css(cssRoot+'.wd-not-found')).isDisplayed();
  };
  this.fillWithInvalidEmail = function(){
    this.typeInField('email','123');
  };
  this.fillWithExistingUser = function(){
    this.typeInField('email','robert@stormpath.com');
  };
  this.fillWithNotfoundUser = function(){
    this.typeInField('email','asdlkfj@asdf.com');
  };
};


describe('Forgot password view', function() {
  var view;
  beforeEach(function(){
    browser.get(browser.params.appUrl + '#/forgot');
    browser.sleep(1000);
    view = new ForgotPasswordView();
  });

  describe('if I enter an invalid email address', function() {
    it('should show me the invalid email error', function() {
      view.fillWithInvalidEmail();
      view.submit();
      browser.sleep(1000);
      expect(view.isShowingInvalidEmail()).to.eventually.equal(true);
    });
  });

  describe('if I enter the email address of a user that exists', function() {
    it('should tell me to check my email for a link', function() {
      view.fillWithExistingUser();
      view.submit();
      browser.sleep(1000);
      expect(view.isShowingSuccess()).to.eventually.equal(true);
    });
  });

  describe('if I enter the email address of a user that does not exist', function() {
    it('should tell me that the user does not exist', function() {
      view.fillWithNotfoundUser();
      view.submit();
      browser.sleep(1000);
      expect(view.isShowingUserNotFound()).to.eventually.equal(true);
    });
  });


});