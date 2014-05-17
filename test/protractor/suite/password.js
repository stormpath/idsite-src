'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

module.exports = function(beforeFn,FormConstructor){

  describe('Password validation', function() {
    var form;
    beforeEach(function(){
      beforeFn();
      form = new FormConstructor();
    });

    describe('if I enter a too short password', function(){
      it('should show the password too short message',function(){
        form.typeAndBlurPassword('a');
        browser.sleep(1000);
        expect(form.isShowingPasswordError('minLength')).to.eventually.equal(true);
      });
    });
    describe('if I enter a too long password', function(){
      it('should show the password too long message',function(){
        form.typeAndBlurPassword('aaaaaaaaaaaaaaaaaaaaaaaaaa');
        browser.sleep(1000);
        expect(form.isShowingPasswordError('maxLength')).to.eventually.equal(true);
      });
    });
    describe('if I enter a password without a lowercase', function(){
      it('should show the lowercase required message',function(){
        form.typeAndBlurPassword('AAAAAAAAAA');
        browser.sleep(1000);
        expect(form.isShowingPasswordError('requireLowerCase')).to.eventually.equal(true);
      });
    });
    describe('if I enter a password without a uppercase', function(){
      it('should show the uppercase required message',function(){
        form.typeAndBlurPassword('aaaaaaaaaa');
        browser.sleep(1000);
        expect(form.isShowingPasswordError('requireUpperCase')).to.eventually.equal(true);
      });
    });
    describe('if I enter a password without a number', function(){
      it('should show the number required message',function(){
        form.typeAndBlurPassword('aaaaaaaaaaAA');
        browser.sleep(1000);
        expect(form.isShowingPasswordError('requireNumeric')).to.eventually.equal(true);
      });
    });

  });
};