var express = require('express');
var nJwt = require('njwt');
var sessions = require('client-sessions');
var stormpath = require('stormpath');
var request = require('request');
var url = require('url');

var IS_PRODUCTION = process.env.NODE_ENV==='production';
var PORT = process.env.PORT || 8001;
var DOMAIN = process.env.DOMAIN || 'stormpath.localhost';
var ID_SITE_PATH = process.env.ID_SITE_PATH || '';
var CB_URI = process.env.CB_URI || ('http://' + DOMAIN + ':' + PORT + '/idSiteCallback' );

var app = express();
var application;
var client = new stormpath.Client();

app.set('views', './views');
app.set('view engine', 'jade');


var spCookieInterface = sessions({
  cookieName: 'sp', // cookie name dictates the key name added to the request object
  secret: 'will be set after client initialization', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
});

var lastJwtCookieInterface = sessions({
  cookieName: 'lastJwt', // cookie name dictates the key name added to the request object
  secret: 'will be set after client initialization', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
});

var idSiteBaseUrlCookieInterface = sessions({
  cookieName: 'idSiteBaseUrl', // cookie name dictates the key name added to the request object
  secret: 'will be set after client initialization', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
});

app.use(lastJwtCookieInterface);
app.use(spCookieInterface);
app.use(idSiteBaseUrlCookieInterface);

app.get('/', function(req, res){
  if(req.sp && req.sp.accountHref){
    client.getAccount(req.sp.accountHref,function(err,account){
      if(err){
        res.render('error',{
          errorText: String(err)
        });
      }else{
        res.render('index',{
          lastJwt: req.lastJwt.value ? JSON.stringify(req.lastJwt.value,null,2) : null,
          account: account,
          accountJson: JSON.stringify(account,null,2),
          cb_uri: CB_URI,
          idSiteBaseUrl: req.idSiteBaseUrl.value
        });
      }
    });
  }else{

    res.render('index',{
      lastJwt: req.lastJwt.value ? JSON.stringify(req.lastJwt.value,null,2) : null,
      account: null,
      cb_uri: CB_URI,
      idSiteBaseUrl: req.idSiteBaseUrl.value
    });

  }
});

app.get('/idSiteCallback',function(req,res){
  if(req.query.jwtResponse){
    application.handleIdSiteCallback(req.url,function(err,idSiteResult){
      if(err){
        res.render('error',{
          errorText: JSON.stringify(err)
        });
      }else{
        if(idSiteResult.status !== 'LOGOUT'){
          req.sp.accountHref = idSiteResult.account.href;
        }
        req.lastJwt.value = nJwt.verify(req.query.jwtResponse,client.config.client.apiKey.secret);
        res.redirect('/');
      }
    });
  }
});


app.get('/login', function(req, res){

  var options = {
    callbackUri: req.query.cb_uri || CB_URI,
    path: ID_SITE_PATH
  };

  if(req.query.sof){
    options.showOrganizationField = Boolean(parseInt(req.query.sof,10));
  }

  if(req.query.onk){
    options.organizationNameKey = req.query.onk;
  }

  if(req.query.usd){
    options.useSubDomain = true;
  }

  if(req.query.state){
    options.state = req.query.state;
  }

  if(req.query.path){
    options.path = req.query.path;
  }
  var ssoRequestUrl = application.createIdSiteUrl(options);

  if(req.query.idSiteBaseUrl) {
    var parsedIdSiteBaseUrl = url.parse(req.query.idSiteBaseUrl);
    var idSiteBaseUrl = parsedIdSiteBaseUrl.protocol + '//' + parsedIdSiteBaseUrl.host;
    req.idSiteBaseUrl.value = idSiteBaseUrl;

    request({
      method: 'GET',
      url: ssoRequestUrl,
      followRedirect: false
    }, function (err, response, body) {
      var idSiteRedirectUrl = response.headers.location || '';
      if (err) {
        res.json(err);
      } else if(response.statusCode !== 302) {
        res.json(body);
      } else if(idSiteRedirectUrl.match(/jwtResponse/)) {
        res.redirect(response.location);
      } else if(req.query.idSiteBaseUrl) {
        var parts = idSiteRedirectUrl.split('/#');
        var newUrl = idSiteBaseUrl + '/#' + parts[1];
        res.setHeader('Location', newUrl);
        res.status(302);
        res.end();
      } else {
        res.redirect(idSiteRedirectUrl);
      }
    });
  } else {
    req.idSiteBaseUrl.value = '';
    res.redirect(ssoRequestUrl);
  }

});

app.get('/logout', function(req, res){
  req.sp.destroy();
  res.redirect(application.createIdSiteUrl({
    callbackUri: CB_URI,
    logout: true
  }));
});




function startServer(){
  lastJwtCookieInterface.secret = client.config.apiKey.secret;
  spCookieInterface.secret = client.config.apiKey.secret;
  console.log('Starting server on port ' + PORT);
  app.listen(PORT,function(){
    console.log('Server running, open this URL in your browser:');
    console.log('http://'+DOMAIN+':'+PORT);
  });

}

function getApplication(then){
  client.getApplication(client.config.application.href,function(err,a){
    if (err){
      throw err;
    }
    application = a;
    then();
  });
}


client.on('ready',function(){
  getApplication(startServer);
});

