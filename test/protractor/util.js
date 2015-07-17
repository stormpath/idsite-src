'use strict';

var request = require('request');

var uuid = require('node-uuid');

var stormpath = require('stormpath');

require('colors');

var client = new stormpath.Client({
  apiKey: new stormpath.ApiKey(
    process.env.STORMPATH_CLIENT_APIKEY_ID,
    process.env.STORMPATH_CLIENT_APIKEY_SECRET
  )
});

var ready = false;
var application = null;
var directory = null;
var loginAccount = null;

function createAccount(application,cb){
  console.log('Create Account'.blue);
  var newAccount = {
    email: 'nobody+'+uuid()+'@stormpath.com',
    givenName: uuid(),
    surname: uuid(),
    password: uuid() + uuid().toUpperCase()
  };
  application.createAccount(newAccount,function(err,account){
    if(err){
      throw err;
    }else{
      account.password = newAccount.password;
      cb(account);
    }
  });
}

function createApplication(client,cb){
  console.log('Create Application'.blue);
  client.createApplication(
    {name:'protractor-test-id-site'+uuid()},
    {createDirectory:true},
    function(err,application){
      if(err){
        throw err;
      }else{
        console.log('Get Application Account Store'.blue);
        client.getApplication(
          application.href,
          {expand:'defaultAccountStoreMapping'},
          function(err,application){
            if(err){
              throw err;
            }else{
              client.getDirectory(application.defaultAccountStoreMapping.href,function(err,dir){
                if(err){
                  throw err;
                }else{
                  directory = dir;
                  createAccount(application,function(account){
                    loginAccount = account;
                    cb(application);
                  });

                }
              });
            }
          }
        );

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

function getJwtUrl(cb){
  var url = application.createIdSiteUrl({
    callbackUri: browser.params.callbackUri
  });
  request(url,{
    followRedirect: false
  },function(err,res,body){
    if(err){
      throw err;
    }else if(res.statusCode!==302){
      throw new Error(body&&body.message || JSON.stringify(body||'Unknown error'));
    }else{
      var jwt = res.headers.location.split('jwt=')[1];
      var url = browser.params.appHost + '#/?jwt=' + jwt;
      cb(url);
    }
  });

}

function cleanup(cb){
  console.log('Begin Cleanup'.blue);
  application.delete(function(err){
    if(err){
      throw err;
    }else{
      directory.delete(function(err){
        if(err){
          throw err;
        }else{
          console.log('Cleanup Complete'.green);
          cb();
        }
      });
    }
  });
}

createApplication(client,function(app){
  application = app;
  prepeareIdSiteModel(client,browser.params.appHost,browser.params.callbackUri,function(){
    ready = true;
  });
});

module.exports = {
  createApplication: createApplication,
  createAccount: createAccount,
  ready: function(){
    return ready;
  },
  application: application,
  getJwtUrl: getJwtUrl,
  cleanup: cleanup,
  getDirectory: function(){
    return directory;
  },
  getLoginAccount: function(){
    return loginAccount;
  }
};