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
  fakeAuthParams: function(appId){
    return '&access_token=' + uuid() +
      '&application_href='+
      encodeURIComponent(browser.params.apiUrl)+
      '%2Fv1%2Fapplications%2F' + (appId || '1');
  }
};