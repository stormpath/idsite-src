'use strict';

var util = require('./test/protractor/util');
var q = require('q');

exports.config = {
  directConnect: true,
  framework: 'mocha',
  specs: ['test/protractor/*.js'],
  exclude: ['test/protractor/util.js'],
  mochaOpts: {
    reporter: 'spec',
    timeout: 20000
  },
  params:{
    // The location of the ID Site application that you are developing
    appHost: 'http://localhost:3000',
    // The location of the app that is initiating the redict to ID Site
    callbackUri: 'https://stormpath.com',
    // The configurable logo URL for ID Site, to assert that it works
    logoUrl: 'https://stormpath.com/images/template/logo-nav.png'
  },

  // multiCapabilities: [
  //   {
  //     'browserName': 'firefox'
  //   },
  //   {
  //     'browserName': 'chrome'
  //   },
  // ],
  onPrepare: function() {
    return browser.driver.wait(function() {
      return util.ready();
    }, 20000);
  },
  onCleanUp: function(exitCode) {
    var deferred = q.defer();

    util.cleanup(function(){
      deferred.resolve(exitCode);
    });
    return deferred.promise;
  },
};
