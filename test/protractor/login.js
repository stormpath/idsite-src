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
  this.waitForForm = function(){
    var self = this;
    return browser.driver.wait(function(){
      return self.isPresent();
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
  var loginAccount;

  beforeEach(function(done){
    app.arriveWithFacebookAndGoogleIntegrations(function(account){
      loginAccount = account;
      done();
    });
  });

  describe('when loaded', function() {

    it('should have the correct page title', function() {
      expect(app.pageTitle()).to.eventually.equal('Login');
    });
    it('should show the logo image', function() {
      form.waitForForm();
      expect(app.logoImageUrl()).to.eventually.equal(browser.params.logoUrl);
    });
    it('should show the login form', function() {
      form.waitForForm();
      expect(form.isPresent()).to.eventually.equal(true);
    });
    it('should allow me to submit the form', function(){
      form.waitForForm();
      form.login(util.getLoginAccount());
      browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
          return url.indexOf(browser.params.callbackUri) > -1;
        });
      }, 10000);
      expect(browser.driver.getCurrentUrl()).to.eventually.contain(browser.params.callbackUri);
    });
  });

  // describe('when loaded with sso config 1 (fb and google)', function() {
  //   var form;

  //   before(function(){
  //     browser.get(
  //       browser.params.appUrl + '#' + util.fakeAuthParams('1')
  //     );
  //     form = new LoginForm();
  //   });
  //   it('should be showing both social buttons', function() {
  //     expect(form.isShowingSocialArea()).to.eventually.equal(true);
  //     expect(form.hasFacebookButton()).to.eventually.equal(true);
  //     expect(form.hasGoogleButton()).to.eventually.equal(true);
  //     expect(form.isShowingRegistrationLink()).to.eventually.equal(true);
  //   });
  // });

  // describe('when loaded with sso config 2 (no social buttons, no logo url)', function() {
  //   var form;

  //   before(function(){
  //     app.arriveWithNoSocialIntegrations();
  //     form = new LoginForm();
  //   });
  //   it('should not show the social area', function() {
  //     expect(form.isShowingSocialArea()).to.eventually.equal(false);
  //   });
  //   it('should not show the logo image', function() {
  //     expect(app.isShowingLogoImage()).to.eventually.equal(false);
  //   });
  // });

  // describe('when loaded with sso config 3 (just the FB button)', function() {
  //   var form;

  //   before(function(){
  //     app.arriveWithOnlyFacebookIntegration();
  //     form = new LoginForm();
  //   });
  //   it('should have the social area and just the FB button', function() {
  //     expect(form.isShowingSocialArea()).to.eventually.equal(true);
  //     expect(form.hasFacebookButton()).to.eventually.equal(true);
  //     expect(form.hasGoogleButton()).to.eventually.equal(false);
  //     expect(form.isShowingRegistrationLink()).to.eventually.equal(true);
  //   });
  // });

  // describe('when loaded with sso config 4 (just the Google button)', function() {
  //   var form;

  //   before(function(){
  //     app.arriveWithOnlyGoogleIntegration();
  //     form = new LoginForm();
  //   });
  //   it('should have the social area and just the Google button', function() {
  //     expect(form.isShowingSocialArea()).to.eventually.equal(true);
  //     expect(form.hasFacebookButton()).to.eventually.equal(false);
  //     expect(form.hasGoogleButton()).to.eventually.equal(true);
  //     expect(form.isShowingRegistrationLink()).to.eventually.equal(true);
  //   });
  // });

  // describe('when loaded with sso config 5 (no password policy, has google login)', function() {
  //   var form;

  //   before(function(){
  //     app.arriveWithoutDefaultAccountStore();
  //     form = new LoginForm();
  //   });
  //   it('should have the social area and just the Google button', function() {
  //     expect(form.isShowingSocialArea()).to.eventually.equal(true);
  //     expect(form.hasFacebookButton()).to.eventually.equal(false);
  //     expect(form.hasGoogleButton()).to.eventually.equal(true);
  //     expect(form.isShowingRegistrationLink()).to.eventually.equal(false);
  //   });
  // });

  // describe('as a user who is registered with the SP who provides valid credentials', function() {
  //   var form = new LoginForm();
  //   before(function(){
  //     app.arriveWithFacebookAndGoogleIntegrations();
  //     form.submitWithValidCredentials();
  //   });
  //   it('should take me to the service provider after login', function() {
  //     browser.sleep(4000);
  //     util.getCurrentUrl(function(url){
  //       expect(url).to.have.string(browser.params.callbackUri);
  //     });
  //   });
  // });

  // describe('as a user who is registered with the SP wh provides INVALID credentials', function() {
  //   var form = new LoginForm();
  //   before(function(){
  //     app.arriveWithFacebookAndGoogleIntegrations();
  //     form.submitWithInvalidCredentials();
  //   });
  //   it('should warn me if I entered the wrong login credentials', function() {
  //     expect(form.isShowingInvalidLogin()).to.eventually.equal(true);
  //   });
  // });

  // describe('as a user who is not registered with the SP', function() {
  //   var form = new LoginForm();
  //   before(function(){
  //     app.arriveWithFacebookAndGoogleIntegrations();
  //     form.submitWithUnknownCredentials();
  //   });
  //   it('should tell me that i ned to register if I try to login', function() {
  //     expect(form.isShowingNotFound()).to.eventually.equal(true);
  //   });
  // });

});