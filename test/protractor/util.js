'use strict';

function uuid(){
  return Math.floor(Math.random()*10000)+'';
}

function fakeJwt(appId,properties){
  var header = {};
  var payload = {
    jti: uuid(),
    iat: new Date().getTime()/1000,
    iss: browser.params.apiUrl,
    sub: uuid(),
    exp: (new Date().getTime()/1000) + 300,
    app_href: browser.params.apiUrl+'/v1/applications/' + appId,
    scope: [],
    state: '',
    init_jti: ''
  };
  properties = typeof properties === 'object' ? properties : {};
  Object.keys(properties).reduce(function(a,k){
    a[k] = properties[k];
    return a;
  },payload);
  var signature = '';
  return encodeURIComponent([header,payload,signature].map(function(v){
    return new Buffer(JSON.stringify(v)).toString('base64');
  }).join('.'));

}

module.exports = {
  getCurrentUrl: function(cb) {
    // workaround for this issue:
    // https://github.com/angular/protractor/issues/132

    browser.executeScript('return window.document.location.href').then(cb);
  },
  fakeAuthParams: function(appId,properties){
    return '?jwt=' + fakeJwt(appId,properties);
  }
};