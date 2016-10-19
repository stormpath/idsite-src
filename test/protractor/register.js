'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

var IdSiteApp = require('./page-objects/idsite-app');
var RegistrationForm = require('./page-objects/registration-form');

describe('Registration view', function() {
  var form = new RegistrationForm();
  var app = new IdSiteApp();
  var mapping;
  before(function(done){
    util.mapDirectory(util.resources.application,util.resources.directory,true,function(asm){
      mapping = asm;
      done();
    });
  });
  beforeEach(function(done){
    app.arriveWithJwt('/#/register',function(){
      form.waitForForm().finally(done);
    });
  });

  after(function(done) {
    util.deleteResource(mapping,done);
  });

  describe('if I enter an invalid email address', function() {
    it('should show me the invalid email error', function() {
      form.typeInField('email','123');
      form.submit();
      expect(form.isShowingInvalidEmail()).to.eventually.equal(true);
    });
  });

  describe('when I submit the form', function() {
    it('should disable the button while waiting for the response', function() {
      form.fillWithValidInformation();
      form.submit();
      expect(form.submitIsDisabled()).to.eventually.equal('true');
    });
  });

  describe('if I try to register a duplicate email address', function() {
    it('should show me the duplicate user error', function() {
      form.fillWithValidInformation();
      form.fillWithDuplicateUser();
      form.submit();
      form.waitForSubmitResult();
      expect(form.isShowingDuplicateUser()).to.eventually.equal(true);
    });
  });

  describe('if I give unique user information and my account is unverified', function() {
    describe.skip('and the directory requires verification',function() {
      // TODO - need to provision a directory which has email verification enabled
      it('should tell me to check my email for a verification link', function() {
        form.fillWithValidInformation();
        form.submit();
        browser.sleep(1000);
        form.waitForSubmitResult();
        expect(browser.driver.getCurrentUrl()).to.eventually.contain('unverified');
      });
    });
    describe('and the directory does not require verification',function() {
      it('should take me to the service provider after form submission', function() {
        form.fillWithValidInformation();
        form.submit();
        app.waitForUrlChange();
        expect(browser.driver.getCurrentUrl()).to.eventually.contain(browser.params.callbackUri);
      });
    });
  });
});

describe.skip('Registration view with password requirements', function() {
  var form = new RegistrationForm();
  require('./suite/password')(function(){
    form.arriveWithPasswordRequirements();
  },RegistrationForm);
});

describe.skip('Registration view with diacritical password requirement', function() {
  var form = new RegistrationForm();
  beforeEach(function(){
    form.arriveWithDiacriticRequirements();
  });

  describe('if I enter a password without a diacritical', function(){
    it('should show the diacritical required message',function(){
      form.typeAndBlurPassword('aaaaaaaaaaAA1');
      expect(form.isShowingPasswordError('requireDiacritical')).to.eventually.equal(true);
    });
  });

});