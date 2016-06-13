'use strict';

var async = require('async');
var express = require('express');
var path = require('path');
var request = require('request');
var stormpath = require('stormpath');
var uuid = require('node-uuid');

require('colors');

var client = new stormpath.Client({
  apiKey: new stormpath.ApiKey(
    process.env.STORMPATH_CLIENT_APIKEY_ID,
    process.env.STORMPATH_CLIENT_APIKEY_SECRET
  )
});

var ready = false;

var resources = {
  application: null,
  directory: null,
  loginAccount: null,
  googleDirectory: null,
  facebookDirectory: null
};

function createAccount(directory,cb){
  console.log('Create Account'.blue);
  var newAccount = {
    email: 'nobody+'+uuid()+'@stormpath.com',
    givenName: uuid(),
    surname: uuid(),
    password: uuid() + uuid().toUpperCase()
  };
  directory.createAccount(newAccount,function(err,account){
    if(err){
      throw err;
    }else{
      account.password = newAccount.password;
      cb(null,account);
    }
  });
}

function createDirectory(client,directoryConfig,cb){
  console.log(('Create Directory ' + directoryConfig.name).blue);

  client.createDirectory(directoryConfig,function(err,directory){
    if(err){
      throw err;
    }else{
      cb(null,directory);
    }
  });
}

function createGoogleDirectory(client,cb) {
  var directoryConfig = {
    name:'protractor-test-id-site-'+uuid(),
    provider: {
      providerId: 'google',
      clientId: uuid(),
      clientSecret: uuid(),
      redirectUri: uuid()
    }
  };
  createDirectory(client,directoryConfig,cb);
}

function createFacebookDirectory(client,cb) {
  var directoryConfig = {
    name:'protractor-test-id-site-'+uuid(),
    provider: {
      providerId: 'facebook',
      clientId: uuid(),
      clientSecret: uuid(),
      redirectUri: uuid()
    }
  };
  createDirectory(client,directoryConfig,cb);
}

function createSamlDirectory(client, cb) {
  var directoryData = {
    name:'protractor-test-id-site-'+uuid(),
    provider: {
      providerId: 'saml',
      ssoLogoutUrl: 'https://stormpathsaml-dev-ded.my.salesforce.com/idp/endpoint/HttpRedirect',
      ssoLoginUrl: 'https://stormpathsaml-dev-ded.my.salesforce.com/idp/endpoint/HttpRedirect',
      encodedX509SigningCert: '-----BEGIN CERTIFICATE-----\nMIIErDCCA5SgAwIBAgIOAVGSh6YMAAAAAHJWVEswDQYJKoZIhvcNAQELBQAwgZAx\nKDAmBgNVBAMMH1NlbGZTaWduZWRDZXJ0XzExRGVjMjAxNV8xOTMyMjExGDAWBgNV\nBAsMDzAwRDE1MDAwMDAwR1lzVTEXMBUGA1UECgwOU2FsZXNmb3JjZS5jb20xFjAU\nBgNVBAcMDVNhbiBGcmFuY2lzY28xCzAJBgNVBAgMAkNBMQwwCgYDVQQGEwNVU0Ew\nHhcNMTUxMjExMTkzMjIyWhcNMTcxMjExMTIwMDAwWjCBkDEoMCYGA1UEAwwfU2Vs\nZlNpZ25lZENlcnRfMTFEZWMyMDE1XzE5MzIyMTEYMBYGA1UECwwPMDBEMTUwMDAw\nMDBHWXNVMRcwFQYDVQQKDA5TYWxlc2ZvcmNlLmNvbTEWMBQGA1UEBwwNU2FuIEZy\nYW5jaXNjbzELMAkGA1UECAwCQ0ExDDAKBgNVBAYTA1VTQTCCASIwDQYJKoZIhvcN\nAQEBBQADggEPADCCAQoCggEBAJ5wNURCyRpekSFKMVZ95hDvLxOdxvb+YlP6b+Xj\nY5TdRVGlJ7JL5vMtOKfcJmP9uDEwN//Iv/CC2+LDwNrwmoPxvcL7IZHRAYkLLKZu\nRtv54DzIQkJ26sQ4hHvXDF5Rb+eus+JhEebN+gbwmfcSlbXOQ5/se1xeTZFkYGDj\n9Myk8im3FQISbU1viuXqC199RsnQbPcOiLcauPvPBlm/WX335ful25Ebtj+4eecV\nFslLXXPtPkXgNlteeS/Ez70viHYhK8TE6dQOFm6Xk6m5mogX8d1h3IXe3NB81NVI\nGhdQog7pSBBlfYbST8PEX0+KsWXV/HZTU+2Jg+tbTRhMBRcCAwEAAaOCAQAwgf0w\nHQYDVR0OBBYEFESEZhu31Qufyz+0oCDTBCZIRi/UMA8GA1UdEwEB/wQFMAMBAf8w\ngcoGA1UdIwSBwjCBv4AURIRmG7fVC5/LP7SgINMEJkhGL9ShgZakgZMwgZAxKDAm\nBgNVBAMMH1NlbGZTaWduZWRDZXJ0XzExRGVjMjAxNV8xOTMyMjExGDAWBgNVBAsM\nDzAwRDE1MDAwMDAwR1lzVTEXMBUGA1UECgwOU2FsZXNmb3JjZS5jb20xFjAUBgNV\nBAcMDVNhbiBGcmFuY2lzY28xCzAJBgNVBAgMAkNBMQwwCgYDVQQGEwNVU0GCDgFR\nkoemDAAAAAByVlRLMA0GCSqGSIb3DQEBCwUAA4IBAQAWgBu9o6lXwr82waBMI8AA\ne+75j+gLXiOdKQK9KXw4XVCSZQsJeaiMapCDIPCCORXfsnQjQUxdN1vKwHM/rV6x\n5GFrWrVfabM5n/p/qTWz3qlawTxPZv1WyTF6UeLCAmsdfBZE29E5GgFZ9LYHW1qh\n09yT+vksFYM4caQPT12eXiEC6uKH9un3D3qhos3LxczER64OkBV1D/IP2H20n9nn\nsuXL6rHgRs3Aii4xmjc6CU9YIRkQ7gE0oYsOujPAHslD/ej6mjJn2XXnjgDB/T5d\nlM/sEIxEPbc4J1Hca8bDNoY+siunoYgqMye+xYobMJCfXACIvzOBx4kjvohVM43U\n-----END CERTIFICATE-----',
      requestSignatureAlgorithm: 'RSA-SHA256'
    }
  }
  createDirectory(client,directoryData,cb);
}

function createApplication(client,cb){
  console.log('Create Application'.blue);
  client.createApplication(
    {name:'protractor-test-id-site-'+uuid()},
    function(err,application){
      if(err){
        throw err;
      }else{
        cb(null,application);
      }
    }
  );
}


function prepeareIdSiteModel(client,currentHost,callbckUri,cb){
  console.log('WARNING! I am modifying your ID Site Configuration'.yellow);
  console.log('\tI am adding ', (browser.params.appHost+'').green , ' to your ',  'authorizedOriginUris'.yellow);
  console.log('\tI am adding ', (browser.params.callbackUri+'').green , ' to your ', 'authorizedRedirectUris'.yellow);
  console.log('\tI am adding ', (browser.params.logoUrl+'').green , ' to your ', 'logoUrl'.yellow);
  console.log('You want to remove these values from your ID Site Configuration before you launch a production application'.yellow);
  console.log('If you need a sandbox environment for testing ID Site, please contact support'.yellow);
  client.getCurrentTenant(function(err,tenant){
    if(err){
      throw err;
    }else{
      client.getResource(tenant.href + '/idSites',function(err,collection){
        if(err){
          throw err;
        }else{
          var idSiteModel = collection.items[0];
          if(idSiteModel.authorizedOriginUris.indexOf(currentHost) === -1){
            idSiteModel.authorizedOriginUris.push(currentHost);
          }
          if(idSiteModel.authorizedRedirectUris.indexOf(callbckUri) === -1){
            idSiteModel.authorizedRedirectUris.push(callbckUri);
          }
          idSiteModel.logoUrl = browser.params.logoUrl;
          idSiteModel.save(function(err){
            if(err){
              throw err;
            }else{
              cb();
            }
          });
        }
      });
    }
  });
}

function getJwtUrl(path,cb){
  var url = resources.application.createIdSiteUrl({
    callbackUri: browser.params.callbackUri,
    path: path
  });

  request(url,{
    followRedirect: false
  },function(err,res,body){
    if(err){
      throw err;
    }else if(res.statusCode!==302){
      throw new Error(body&&body.message || JSON.stringify(body||'Unknown error'));
    }else{
      var fragment = res.headers.location.split('/#')[1];
      var url = browser.params.appHost + '#' + fragment;
      cb(url);
    }
  });

}
function deleteResource(resource,cb){
  console.log(('Delete').blue,resource.href);
  resource.delete(cb);
}

function cleanup(cb){
  console.log('Begin Cleanup'.blue);

  var toDelete = Object.keys(resources).map(function(key){
    return resources[key];
  });

  // Sort the application resource to the end, as it should be deleted last
  toDelete.sort(function(a,b){
    var _a = a.href.match(/applications/);
    var _b = b.href.match(/applications/);
    return ( _a === _b ) ? 0 : ( _a ? 1 : -1);
  });

  async.eachSeries(toDelete,deleteResource,function(err){
    if(err){
      throw err;
    }else{
      console.log('Cleanup Complete'.blue);
      cb();
    }
  });
}

function mapDirectory(application,directory,isDefaultAccountStore,cb) {
  var mapping = {
    application: {
      href: application.href
    },
    accountStore: {
      href: directory.href
    },
    isDefaultAccountStore: isDefaultAccountStore
  };

  application.createAccountStoreMapping(mapping, function(err, mapping){
    if(err){
      throw err;
    }else{
      cb(mapping);
    }
  });
}

function startAppServer(done){
  var app = express();
  app.use(express.static(path.join(__dirname, '..','..','dist')));
  app.get('/stormpathCallback', function(req,res){
    res.json(req.query || {});
  });
  console.log('Starting Asset Server');
  app.listen(3000,done);
}

async.parallel({
  app: startAppServer,
  googleDirectory: createGoogleDirectory.bind(null,client),
  facebookDirectory: createFacebookDirectory.bind(null,client),
  samlDirectory: createSamlDirectory.bind(null,client),
  application: createApplication.bind(null,client),
  directory: createDirectory.bind(null,client,{name:'protractor-test-id-site-'+uuid()})
},function(err,results) {
  if(err){
    throw err;
  }else{
    resources.googleDirectory = results.googleDirectory;
    resources.facebookDirectory = results.facebookDirectory;
    resources.application = results.application;
    resources.directory = results.directory;
    resources.samlDirectory = results.samlDirectory;

    async.parallel({
      idSiteModel: prepeareIdSiteModel.bind(null,client,browser.params.appHost,browser.params.callbackUri),
      account: createAccount.bind(null,resources.directory)
    },function(err,results) {
      if(err){
        throw err;
      }else{
        resources.loginAccount = results.account;
        ready = true;
      }
    });

  }
});

module.exports = {
  createApplication: createApplication,
  createAccount: createAccount,
  deleteResource: deleteResource,
  ready: function(){
    return ready;
  },
  resources: resources,
  getJwtUrl: getJwtUrl,
  cleanup: cleanup,
  getDirectory: function(){
    return resources.directory;
  },
  getLoginAccount: function(){
    return resources.loginAccount;
  },
  mapDirectory: mapDirectory
};