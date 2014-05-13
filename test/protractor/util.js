'use strict';

function uuid(){
  return Math.floor(Math.random()*10000)+'';
}

module.exports = {
  getCurrentUrl: function(cb) {
    // workaround for this issue:
    // https://github.com/angular/protractor/issues/132
    // https://github.com/angular/protractor/issues/132

    browser.executeScript('return window.document.location.href').then(cb);
  },
  fakeAuthParams: function(){
    return '&access_token=' + uuid() +
      '&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234';
  }
};