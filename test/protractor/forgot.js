'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var IdSiteApp = require('./page-objects/idsite-app');
var ForgotPasswordForm = require('./page-objects/forgot-password-form');

describe('Forgot password form', function() {
  var form = new ForgotPasswordForm();
  var app = new IdSiteApp();
  beforeEach(function(done){
    app.arriveWithJwt('/#/forgot',function(){
      form.waitForForm();
      // apparently we need some time to let the password policy value appear
      // in the scope of the registration controller
      browser.sleep(1000);
      done();
    });
  });

  describe('upon arrival', function() {
    it('should show me a link to return to login', function() {
      expect(form.isShowingBackToLogin()).to.eventually.equal(true);
    });
  });

  describe('if I enter an invalid email address', function() {
    it('should show me the invalid email error', function() {
      form.fillWithInvalidEmail();
      form.submit();
      expect(form.isShowingInvalidEmail()).to.eventually.equal(true);
    });
  });

  describe('if I submit the form with a valid email address', function() {
    it('should tell me to check my email for a link', function() {
      form.fillWithValidEmail();
      form.submit();
      form.waitForSubmitResult();
      expect(form.isShowingSuccess()).to.eventually.equal(true);
    });
    it('should hide the back-to-login link', function() {
      expect(form.isShowingBackToLogin()).to.eventually.equal(true);
    });
  });

  describe('if I enter an email with whitespace in the front', function() {
    it('should succeed', function() {
      form.fillWithEmailAndWhitespaceAtFront();
      form.submit();
      form.waitForSubmitResult();
      expect(form.isShowingSuccess()).to.eventually.equal(true);
    });
  });

  describe('if I try to use the back button after a successful sent', function() {
    it('should keep me on this form', function() {
      form.fillWithValidEmail();
      form.submit();
      form.pressBackButton();
      expect(browser.driver.getCurrentUrl()).to.eventually.contain('#/forgot');
    });
  });

});