'use strict';

module.exports = {
  getCurrentUrl: function(cb) {
    // workaround for this issue:
    // https://github.com/angular/protractor/issues/132
    // https://github.com/angular/protractor/issues/132

    browser.executeScript('return window.document.location.href').then(cb);
  }
};