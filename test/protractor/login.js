'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

var uuid = require('node-uuid');

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
  this.isShowingSocialArea = function(){
    return element(by.css('.social-area')).isDisplayed();
  };
  this.isShowingUsernameField = function(){
    return element(by.css('.login-form input[name=username]')).isDisplayed();
  };
  this.hasSocialArea = function(){
    return browser.isElementPresent(by.css('.social-area'));
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
  this.submitWithValidCredentials = function submitWithValidCredentials(){
    this.typeInField('username','robert@stormpath.com');
    this.typeInField('password','robert@stormpath.com');
    this.submit();
  };
  this.submitWithInvalidCredentials = function submitWithInvalidCredentials(){
    this.typeInField('username','robert@stormpath.com');
    this.typeInField('password','1');
    this.submit();
  };
  this.submitWithUnknownCredentials = function submitWithUnknownCredentials(){
    this.typeInField('username',uuid());
    this.typeInField('password',uuid());
    this.submit();
  };
};

var LoginApp = require('./page-objects/login-app');

describe('Login view', function() {
  var app = new LoginApp();
  var form = new LoginForm();

  beforeEach(function(done){
    app.arriveWithJwt(function(){
      form.waitForForm();
      done();
    });
  });

  describe('If a password-based directory is mapped', function() {

    var mapping;

    before(function(done) {
      util.mapDirectory(util.resources.application,util.resources.directory,function(asm){
        mapping = asm;
        done();
      });
    });

    after(function(done) {
      util.deleteResource(mapping,done);
    });

    beforeEach(function(done){
      app.arriveWithJwt(function(){
        form.waitForForm();
        done();
      });
    });

    it('should have the correct page title', function() {
      expect(app.pageTitle()).to.eventually.equal('Login');
    });

    it('should show the logo image', function() {
      expect(app.logoImageUrl()).to.eventually.equal(browser.params.logoUrl);
    });

    it('should show the login form', function() {
      expect(form.isPresent()).to.eventually.equal(true);
    });

    it('should not show the social login area',function(){
      expect(form.isShowingSocialArea()).to.eventually.equal(false);
    });

    it('should not show the registration link',function() {
      expect(form.isShowingRegistrationLink()).to.eventually.equal(false);
    });

    it('should allow me to submit the form', function(){
      form.login(util.getLoginAccount());
      browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
          return url.indexOf(browser.params.callbackUri) > -1;
        });
      }, 10000);
      expect(browser.driver.getCurrentUrl()).to.eventually.contain(browser.params.callbackUri);
    });

    it('should disable the form while submitting',function(){
      form.login({email:'me@stormpath.com',password:'b'});
      // assert that it becomes disabled
      expect(form.submitIsDisabled()).to.eventually.equal('true');
      // then wait for, and assert, that it becomes enabled
      // after the network request is complete
      form.waitForLoginAttempt();
      expect(form.submitIsDisabled()).to.eventually.equal(null);
    });

    it('should show me an error if I enter invalid credentials',function(){
      form.login({email:'me@stormpath.com',password:'b'});
      form.waitForLoginAttempt();
      expect(form.isShowingInvalidLogin()).to.eventually.equal(true);
    });
  });

  describe('If a google directory is mapped to the application',function() {
    var mapping;
    before(function(done) {
      util.mapDirectory(util.resources.application,util.resources.googleDirectory,function(asm){
        mapping = asm;
        done();
      });
    });
    after(function(done) {
      util.deleteResource(mapping,done);
    });
    it('should show the google login button',function() {
      expect(form.hasGoogleButton()).to.eventually.equal(true);

    });
  });

  describe('If a facebook directory is mapped to the application',function() {
    var mapping;
    before(function(done) {
      util.mapDirectory(util.resources.application,util.resources.facebookDirectory,function(asm){
        mapping = asm;
        done();
      });
    });
    after(function(done) {
      util.deleteResource(mapping,done);
    });
    it('should show the facebook login button',function() {
      expect(form.hasFacebookButton()).to.eventually.equal(true);
    });
  });

  describe('If only social providers are mapped to the application',function() {

    var mapping;
    before(function(done) {
      util.mapDirectory(util.resources.application,util.resources.facebookDirectory,function(asm){
        mapping = asm;
        done();
      });
    });
    beforeEach(function() {
      form.waitForForm();
    });
    after(function(done) {
      util.deleteResource(mapping,done);
    });
    it('should not show the registration link',function() {
      expect(form.isShowingRegistrationLink()).to.eventually.equal(false);
    });

    // TODO !
    it.skip('should not show the login form',function() {
      expect(form.hasFacebookButton()).to.eventually.equal(true);
    });
  });

});