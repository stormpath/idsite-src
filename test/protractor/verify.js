'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

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
      browser.get(
        browser.params.appUrl + '#/verify' + util.fakeAuthParams('1') + '&sptoken=avalidtoken'
      );
      browser.sleep(3000);
    });
    it('should take me to the service provider', function() {
      browser.sleep(4000);
      util.getCurrentUrl(function(url){
        expect(url).to.have.string('https://stormpath.com');
      });
    });
  });

  describe('with an invalid token', function() {
    var view = new VerificationView();
    before(function(){
      browser.get(
        browser.params.appUrl + '#/verify' + util.fakeAuthParams('1') + '&sptoken=invalid'
      );
      browser.sleep(3000);
    });
    it('should tell me that there was an error', function() {
      expect(view.isShowingError()).to.eventually.equal(true);
    });
  });

});