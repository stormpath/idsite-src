'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var VerificationView = function(){
  var cssRoot = '.verify-view ';
  this.isShowingSuccess = function(){
    return element(by.css(cssRoot+'.verified')).isDisplayed();
  };
  this.isShowingError = function(){
    return element(by.css(cssRoot+'.verification-failed')).isDisplayed();
  };
};


describe('Email verification view', function() {

  describe('with a valid token', function() {
    var view = new VerificationView();
    before(function(){
      browser.get(browser.params.appUrl + '?emailVerificationToken=1#/verify');
      browser.sleep(3000);
    });
    it('should tell me success and that I can log in', function() {
      expect(view.isShowingSuccess()).to.eventually.equal(true);
    });
  });

  describe('with an invalid token', function() {
    var view = new VerificationView();
    before(function(){
      browser.get(browser.params.appUrl + '?emailVerificationToken=2#/verify');
      browser.sleep(3000);
    });
    it('should tell me that there was an error', function() {
      expect(view.isShowingError()).to.eventually.equal(true);
    });
  });

});