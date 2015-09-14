'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var util = require('./util');

describe.skip('Verification view', function() {

  describe('if I arrive here directly', function() {

    before(function(){
      browser.get(
        browser.params.appUrl + '#/unverified' + util.fakeAuthParams('1')
      );
    });
    it('should take me to the login view', function() {
      browser.sleep(1000);
      util.getCurrentUrl(function(url){
        expect(url).to.match(/\/#\/\?/);
      });
    });
  });

});