'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

var RegistrationForm = function(){
  var cssRoot = '.registration-form ';
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
  this.isShowingInvalidEmail = function(){
    return element(by.css(cssRoot+'.group-email .validation-error')).isDisplayed();
  };
  this.isShowingDuplicateUser = function(){
    return element(by.css(cssRoot+'.duplicate-user')).isDisplayed();
  };
  this.isShowingPasswordError = function(error){
    return element(by.css('[wd-'+error+']')).isDisplayed();
  };
  this.fillWithValidInformation = function(){
    this.typeInField('givenName','test');
    this.typeInField('surname','test');
    this.typeInField('email','joe@somewhere.com');
    this.typeInField('password','aaaaaaaaA1');
    this.typeInField('passwordConfirm','aaaaaaaaA1');
  };
  this.fillWithDuplicateUser = function(){
    this.fillWithValidInformation();
    this.clearField('email');
    this.typeInField('email','robert@stormpath.com');
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


describe('Registration view', function() {
  var form = new RegistrationForm();
  beforeEach(function(){
    form.arriveWithPasswordRequirements();
  });

  describe('if I enter an invalid email address', function() {
    it('should show me the invalid email error', function() {
      form.typeInField('email','123');
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

  describe('if I give valid, new user information and my account is unverified', function() {
    it('should tell me to check my email for a verification link', function() {
      form.fillWithValidInformation();
      form.submit();
      browser.sleep(1000);
      util.getCurrentUrl(function(url){
        expect(url).to.have.string('unverified');
      });
    });
  });
  describe('if I give valid, new user information and my account is verified', function() {
    it('should take me to the service provider after login', function() {
      form.fillWithValidInformation();
      form.clearField('givenName');
      form.typeInField('givenName','verified'); // mock is programmed for this
      form.submit();
      browser.sleep(1000);
      util.getCurrentUrl(function(url){
        expect(url).to.have.string('https://stormpath.com');
      });

    });
  });

});

describe('Registration view with password requirements', function() {
  var form = new RegistrationForm();
  require('./suite/password')(function(){
    form.arriveWithPasswordRequirements();
  },RegistrationForm);
});

describe('Registration view with diacritical password requirement', function() {
  var form = new RegistrationForm();
  beforeEach(function(){
    form.arriveWithDiacriticRequirements();
  });

  describe('if I enter a password without a diacritical', function(){
    it('should show the diacritical required message',function(){
      form.typeAndBlurPassword('aaaaaaaaaaAA1');
      expect(form.isShowingPasswordError('diacritical')).to.eventually.equal(true);
    });
  });

});