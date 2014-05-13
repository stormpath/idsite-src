'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

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
  this.isShowingFacebookButton = function(){
    return element(by.css('.btn-facebook')).isDisplayed();
  };
  this.isShowingGoogleButton = function(){
    return element(by.css('.btn-google')).isDisplayed();
  };
  this.isShowingSocialArea = function(){
    return element(by.css('.social-area')).isDisplayed();
  };
  this.hasSocialArea = function(){
    return browser.isElementPresent(by.css('.social-area'));
  };
};

describe('Login view', function() {

  describe('when loaded', function() {
    before(function(){
      browser.get(browser.params.appUrl);
    });
    it('should have the correct page title', function() {
      expect(browser.getTitle()).to.eventually.equal('Login');
    });
  });

  describe('when loaded with sso config 1 (fb and google)', function() {
    var form;

    before(function(){
      browser.get(
        browser.params.appUrl + '#' + util.fakeAuthParams('1234')
      );
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should be showing both social buttons', function() {
      expect(form.isShowingSocialArea()).to.eventually.equal(true);
      expect(form.isShowingFacebookButton()).to.eventually.equal(true);
      expect(form.isShowingGoogleButton()).to.eventually.equal(true);
    });
  });

  describe('when loaded with sso config 2 (no social buttons)', function() {
    var form;

    before(function(){
      browser.get(
        browser.params.appUrl + '#' + util.fakeAuthParams('2')
      );
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should not show the social area', function() {
      expect(form.isShowingSocialArea()).to.eventually.equal(false);
    });
  });

  describe('when loaded with sso config 3 (just the FB button)', function() {
    var form;

    before(function(){
      browser.get(
        browser.params.appUrl + '#' + util.fakeAuthParams('3')
      );
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should have the social area and just the FB button', function() {
      expect(form.isShowingSocialArea()).to.eventually.equal(true);
      expect(form.isShowingFacebookButton()).to.eventually.equal(true);
      expect(form.isShowingGoogleButton()).to.eventually.equal(false);
    });
  });

  describe('when loaded with sso config 4 (just the Google button)', function() {
    var form;

    before(function(){
      browser.get(
        browser.params.appUrl + '#' + util.fakeAuthParams('4')
      );
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should have the social area and just the Google button', function() {
      expect(form.isShowingSocialArea()).to.eventually.equal(true);
      expect(form.isShowingFacebookButton()).to.eventually.equal(false);
      expect(form.isShowingGoogleButton()).to.eventually.equal(true);
    });
  });

  describe('as a user who is registered with the SP', function() {
    var form;
    before(function(){
      browser.get(
        browser.params.appUrl + '#' + util.fakeAuthParams()
      );
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should allow me to login', function() {
      form.typeInField('username','robert@stormpath.com');
      form.typeInField('password','robert@stormpath.com');
      form.submit();
    });
    it('should take me to the service provider after login', function() {
      browser.sleep(4000);
      util.getCurrentUrl(function(url){
        expect(url).to.have.string('https://stormpath.com');
      });
    });
  });

  describe('as a user who is registered with the SP', function() {
    var form;
    before(function(){
      browser.get(
        browser.params.appUrl + '#' + util.fakeAuthParams()
      );
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should warn me if I entered the wrong login credentials', function() {
      form.typeInField('username','robert@stormpath.com');
      form.typeInField('password','1');
      form.submit();
      browser.sleep(1000);
      expect(form.isShowingInvalidLogin()).to.eventually.equal(true);
    });
  });

  describe('as a user who is not registered with the SP', function() {
    var form;
    before(function(){
      browser.get(
        browser.params.appUrl + '#' + util.fakeAuthParams()
      );
      browser.sleep(1000);
      form = new LoginForm();
    });
    it('should tell me that i ned to register if I try to login', function() {
      form.typeInField('username','1');
      form.typeInField('password','1');
      form.submit();
      browser.sleep(1000);
      expect(form.isShowingNotFound()).to.eventually.equal(true);
    });
  });

});