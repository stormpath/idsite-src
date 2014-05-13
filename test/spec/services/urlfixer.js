'use strict';

describe('URL rewriter', function () {

  var rewriter = window.SpHashUrlRewriter;

  var cases = [
    {
      url:    'http://local.stormpath.com:9000/#',
      expect: 'http://local.stormpath.com:9000/#',
    },
    {
      url:    'http://local.stormpath.com:9000/#register',
      expect: 'http://local.stormpath.com:9000/#register',
    },
    {
      url:    'http://local.stormpath.com:9000/#register?',
      expect: 'http://local.stormpath.com:9000/#register?',
    },
    {
      url:    'http://local.stormpath.com:9000/#register&',
      expect: 'http://local.stormpath.com:9000/#register&',
    },
    {
      url:    'http://local.stormpath.com:9000/#/access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234',
      expect: 'http://local.stormpath.com:9000/#?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234',
    },
    {
      url:    'http://local.stormpath.com:9000/#access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234',
      expect: 'http://local.stormpath.com:9000/#?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234',
    },
    {
      url:    'http://local.stormpath.com:9000/#reset&access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=aaa',
      expect: 'http://local.stormpath.com:9000/#reset?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=aaa'
    },
    {
      url:    'http://local.stormpath.com:9000/#/reset&access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=aaa',
      expect: 'http://local.stormpath.com:9000/#/reset?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=aaa'
    },
    {
      url:    'http://local.stormpath.com:9000/#reset?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=vvv',
      expect: 'http://local.stormpath.com:9000/#reset?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=vvv'
    },
    {
      url:    'http://local.stormpath.com:9000/#/reset?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=vvv',
      expect: 'http://local.stormpath.com:9000/#/reset?access_token=1234&application_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fapplications%2F1234&sptoken=vvv'
    }
  ];

  cases.map(function(c){
    it('should change ' + c.ur+ ' to ' + c.expect, function () {
      expect(rewriter(c.url)).to.equal(c.expect);
    });
  });



});
