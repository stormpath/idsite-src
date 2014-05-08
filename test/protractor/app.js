'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;


describe('login app', function() {

  describe('when loaded', function() {
    before(function(){
      browser.get(browser.params.appUrl);
    });
    it('should have the correct page title', function() {
      expect(browser.getTitle()).to.eventually.equal('Login');
    });
  });

});