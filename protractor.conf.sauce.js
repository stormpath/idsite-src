var baseConfig = require('./protractor.conf.js').config;
'use strict';

baseConfig.directConnect = false;
baseConfig.sauceUser = process.env.SAUCE_USERNAME;
baseConfig.sauceKey = process.env.SAUCE_ACCESS_KEY;

exports.config = baseConfig;