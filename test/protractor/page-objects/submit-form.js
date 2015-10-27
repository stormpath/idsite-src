'use strict';

var SubmitForm = function(){

  this.submit = function(){
    return element(by.css(this.cssRoot+'button')).submit();
  };
  this.submitIsDisabled = function() {
    return element(by.css(this.cssRoot +' button[type=submit]')).getAttribute('disabled');
  };
  this.waitForForm = function(){
    /*
      TODO - implenet something in the stormpath.js client
      which keeps track of the "is waiting for a network request"
      state.  then, we can get rid of these wait functions and have
      a common "wait for client" function.
     */
    var self = this;
    return browser.driver.wait(function(){
      return self.isPresent();
    },10000);
  };
  this.waitForSubmitResult = function(){
    var self = this;
    browser.driver.wait(function(){
      return self.submitIsDisabled().then(function(value) {
        return value === null;
      });
    },10000);
  };
};

module.exports = SubmitForm;