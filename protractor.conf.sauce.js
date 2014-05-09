exports.config = {
  framework: 'mocha',
  specs: ['test/protractor/**/*.js'],
  allScriptsTimeout: 60000,
  multiCapabilities: [
    // {
    //   'browserName': 'internet explorer',
    //   'platform': 'Windows 8.1',
    //   'version': '11'
    // },
    // {
    //   'browserName': 'internet explorer',
    //   'platform': 'Windows 8',
    //   'version': '10'
    // },
    {
      'browserName': 'internet explorer',
      'platform': 'Windows 7',
      'version': '9'
    },
    // {
    //   'browserName': 'firefox',
    //   'platform': 'Windows 7',
    //   'version': '20'
    // },
    // {
    //   'browserName': 'chrome',
    //   'platform': 'Windows 8',
    //   'version': '30'
    // },
    // {
    //   'browserName': 'safari',
    //   'platform': 'OS X 10.9',
    //   'version': '7'
    // },
    // {
    //   'browserName': 'chrome',
    //   'platform': 'OS X 10.9',
    //   'version': '33'
    // }
  ]
};