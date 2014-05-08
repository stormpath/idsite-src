exports.config = {
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.41.0.jar',
  framework: 'mocha',
  specs: ['test/protractor/**/*.js'],
  multiCapabilities: [
    {
      'browserName': 'firefox'
    },
    {
      'browserName': 'chrome'
    },
  ]
};