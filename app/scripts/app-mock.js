'use strict';




function MockStormpath(){
  function uuid(){
    return Math.floor(Math.random()*10000);
  }
  function CsrfResponse(appHref){
    return {
      appHref: appHref,
      csrfToken: uuid(),
      hpValue: uuid(),
      expires: new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
  }
  function respondWithApplication(appHref,xhr){

    var response = {
      'href' : appHref,
      'loginAttempts': {
        href: appHref + '/loginAttempts'
      },
      'accounts': {
        href: appHref + '/accounts'
      },
      'passwordResetTokens': {
        href: appHref + '/passwordResetTokens'
      },
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }

  function respondWithLoginSuccess(accountHref,xhr){
    var response = {
      'account': {
        'href' : accountHref
      },
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      200,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }

  function respondWithLoginFailure(xhr){
    var response = {
      'status': 400,
      'code': 400,
      'message': 'Invalid username or password.',
      'developerMessage': 'Invalid username or password.',
      'moreInfo': 'mailto:support@stormpath.com',
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      400,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }


  function respondWithUserNotFound(xhr){
    var response = {
      status: 404,
      code: 404,
      message: 'The requested resource does not exist.',
      developerMessage: 'The requested resource does not exist.',
      moreInfo: 'mailto:support@stormpath.com',
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      404,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }

  var sinon = window.sinon;


  var server = sinon.fakeServer.create();



  server.respondWith('POST', 'https://api.stormpath.com/v1/applications/1234/csrfToken',

    function(xhr){
      console.log('TOKEN REQUEST');
      xhr.respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify( new CsrfResponse('/v1/applications/1234/'))
      );
    }
    );

  server.respondWith(
    'POST',
    'https://api.stormpath.com/v1/applications/1234/loginAttempts?expand=account',
    function(xhr){
      var validLogin = '{"type":"basic","value":"MTox"}'; // use '1' for username and password
      var badLogin = '{"type":"basic","value":"Mjoy"}'; // use '2' for username and password
      if(xhr.requestBody===validLogin){
        respondWithLoginSuccess('https://api.stormpath.com/v1/applications/1234',xhr);
      }else if(xhr.requestBody===badLogin){
        respondWithLoginFailure(xhr);
      }else{
        respondWithUserNotFound(xhr);
      }

    }

  );

  server.respondWith(
    'GET',
    'https://api.stormpath.com/v1/applications/1234',
    function(xhr){
      respondWithApplication('https://api.stormpath.com/v1/applications/1234',xhr);
    }

  );

  server.autoRespond = true;
  server.autoRespondAfter = 200;
  return server;

}

window.fakeserver = new MockStormpath();