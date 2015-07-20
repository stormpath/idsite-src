'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

var ErrorPage = function(){

  this.arrive = function arrive(){
    browser.ignoreSynchronization = true;
    console.log('browser.params',browser.params);
    browser.get(
      'error.html'
    );
    browser.sleep(1000);
  };
  this.hasErrorMessage = function(){
    return element(by.css('[wd-error-message]')).isPresent();
  };
};


describe.skip('error.html page', function() {
  var page = new ErrorPage();
  before(function(){
    page.arrive();
  });

  after(function(){
    browser.ignoreSynchronization = false;
  });

  it('should show an error message', function() {
    expect(page.hasErrorMessage()).to.eventually.equal(true);
  });


});