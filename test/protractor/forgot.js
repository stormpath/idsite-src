'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

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
  this.fillWithValidEmail = function(){
    this.typeInField('email','robert@stormpath.com');
  };
  this.arrive = function(){
    browser.get(
      browser.params.appUrl + '#/forgot' + util.fakeAuthParams('1')
    );
  };
};


describe('Forgot password view', function() {
  var view = new ForgotPasswordView();
  beforeEach(function(){
    view.arrive();
  });

  describe('if I enter an invalid email address', function() {
    it('should show me the invalid email error', function() {
      view.fillWithInvalidEmail();
      view.submit();
      expect(view.isShowingInvalidEmail()).to.eventually.equal(true);
    });
  });

  describe('if I submit the form with a valid email address', function() {
    it('should tell me to check my email for a link', function() {
      view.fillWithValidEmail();
      view.submit();
      expect(view.isShowingSuccess()).to.eventually.equal(true);
    });
  });

});