'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

var LoginForm = require('./page-objects/login-form');

var IdSiteApp = require('./page-objects/idsite-app');

describe('Login Flow', function() {
  var app = new IdSiteApp();
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