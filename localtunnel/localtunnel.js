var localtunnel = require('localtunnel');
var stormpath = require('stormpath');

var callbckUri = 'http://stormpath.localhost:8001/idSiteCallback';
var client = new stormpath.Client();
var doCleanup = false;
var previousDomainName = null;
var host = null;

/*eslint no-console: 0*/

function prepeareIdSiteModel(client, idSiteApplicationHost, callbckUri, cb) {
  client.getCurrentTenant(function(err, tenant) {
    if (err) {
      throw err;
    }

    client.getResource(tenant.href + '/idSites', function(err, collection) {
      if (err) {
        throw err;
      }

      var idSiteModel = collection.items[0];

      previousDomainName = idSiteModel.domainName;

      idSiteModel.domainName = idSiteApplicationHost.split('//')[1];

      if (idSiteModel.authorizedOriginUris.indexOf(idSiteApplicationHost) === -1) {
        idSiteModel.authorizedOriginUris.push(idSiteApplicationHost);
        idSiteModel.authorizedOriginUris.push(idSiteApplicationHost.replace('https','http'));
      }

      if (idSiteModel.authorizedRedirectUris.indexOf(callbckUri) === -1) {
        idSiteModel.authorizedRedirectUris.push(callbckUri);
      }

      idSiteModel.save(cb);
    });
  });
}

function revertIdSiteModel(client, idSiteApplicationHost, callbckUri, cb) {
  client.getCurrentTenant(function(err, tenant) {
    if (err) {
      throw err;
    }

    client.getResource(tenant.href + '/idSites', function(err, collection) {
      if (err) {
        throw err;
      }

      var idSiteModel = collection.items[0];

      idSiteModel.domainName = previousDomainName;

      idSiteModel.authorizedOriginUris = idSiteModel.authorizedOriginUris.filter(function(uri) {
        return !uri.match(idSiteApplicationHost);
      });

      idSiteModel.authorizedOriginUris = idSiteModel.authorizedOriginUris.filter(function(uri) {
        return !uri.match(idSiteApplicationHost.replace('https','http'));
      });

      idSiteModel.authorizedRedirectUris = idSiteModel.authorizedRedirectUris.filter(function(uri) {
        return !uri.match(callbckUri);
      });

      idSiteModel.save(cb);
    });
  });
}

function cleanup(cb){
  if(doCleanup){
    revertIdSiteModel(client,host,callbckUri,function (err) {
      if (err) {
        throw err;
      }
      console.log('ID Site Model Restored');
      cb();
    });
  }
}

var tunnel = localtunnel(process.env.PORT || 9000, function(err, tunnel) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }
  host = tunnel.url;
  console.log(host);
  prepeareIdSiteModel(client,host,callbckUri,function(err){
    if (err) {
      throw err;
    }
    console.log('ID Site Model Ready');
    setInterval(function () { },1000);
    doCleanup = true;
  });

});

tunnel.on('error', function (err) {
  console.error(err);
  cleanup();
});

tunnel.on('close', cleanup);

process.on('SIGTERM', function() {
  console.log('\nCaught termination signal');
  cleanup(function (){
    process.exit();
  });
});

process.on('SIGINT', function() {
  console.log('\nCaught interrupt signal');
  cleanup(function (){
    process.exit();
  });
});
