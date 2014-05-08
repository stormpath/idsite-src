'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var RegistrationForm = function(){
  var cssRoot = '.registration-form ';
  this.typeInField = function(field,value){
    return element(by.css(cssRoot+'input[name='+field+']')).sendKeys(value);
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
  this.fillWithValidInformation = function(){
    this.typeInField('givenName','test');
    this.typeInField('surname','test');
    this.typeInField('username','joe@somewhere.com');
    this.typeInField('password','abC123');
    this.typeInField('passwordConfirm','abC123');
  };
  this.fillWithDuplicateUser = function(){
    this.fillWithValidInformation();
    this.clearField('username');
    this.typeInField('username','robert@stormpath.com');
  };
};


describe('Registration view', function() {
  var form;
  beforeEach(function(){
    browser.get(browser.params.appUrl + '#/register');
    browser.sleep(1000);
    form = new RegistrationForm();
  });

  describe('if I enter an invalid email address', function() {
    it('should show me the invalid email error', function() {
      form.typeInField('username','123');
      form.submit();
      browser.sleep(1000);
      expect(form.isShowingInvalidEmail()).to.eventually.equal(true);
    });
  });

  describe('if I try to register a duplicate email address', function() {
    it('should show me the duplicate user error', function() {
      form.fillWithDuplicateUser();
      form.submit();
      browser.sleep(1000);
      expect(form.isShowingDuplicateUser()).to.eventually.equal(true);
    });
  });

  describe('if I give valid, new user information', function() {
    it('should tell me to check my email for a verification link', function() {
      form.fillWithValidInformation();
      form.submit();
      browser.sleep(1000);
      expect(browser.getCurrentUrl()).to.eventually.have.string('unverified');
    });
  });

});