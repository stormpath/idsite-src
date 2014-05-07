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
      'redirectTo': 'https://stormpath.com',
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

  function respondWithNewAccount(account,verified,xhr){
    var id = uuid();
    var response = {
      'href' : 'https://api.stormpath.com/v1/accounts/' + id,
      'username' : account.username,
      'email' : account.email || account.username,
      'fullName' : account.givenName + ' ' + account.surname,
      'givenName' : account.givenName,
      'middleName' : '',
      'surname' : account.surname,
      'status' : verified? 'VERIFIED':'UNVERIFIED',
      'customData': {
        'href': 'https://api.stormpath.com/v1/accounts/'+id+'/customData'
      },
      'groups' : {
        'href' : 'https://api.stormpath.com/v1/accounts/'+id+'/groups'
      },
      'groupMemberships' : {
        'href' : 'https://api.stormpath.com/v1/accounts/'+id+'/groupMemberships'
      },
      'directory' : {
        'href' : 'https://api.stormpath.com/v1/directories/' + uuid()
      },
      'tenant' : {
        'href' : 'https://api.stormpath.com/v1/tenants/' + uuid()
      },
      'emailVerificationToken' : {
        'href' : 'https://api.stormpath.com/v1/accounts/emailVerificationTokens/' + uuid()
      },
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };

    if(verified){
      response.redirectTo = 'https://stormpath.com';
    }

    xhr.respond(201,{'Content-Type': 'application/json'},JSON.stringify(response));
  }

  function respondWithDuplicateUser(xhr){

    var response = {
      status: 409,
      code: 2001,
      userMessage: 'Account with that username already exists.  Please choose another username.',
      developerMessage: 'Account with that username already exists.  Please choose another username.',
      moreInfo: 'http://docs.stormpath.com/errors/2001',
      message: 'HTTP 409, Stormpath 2001 (http://docs.stormpath.com/errors/2001): Account with that username already exists.  Please choose another username.',
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      409,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }

  function respondWithOtherError(xhr){
    var response = {
      status: 499,
      code: 499,
      userMessage: 'Something bad happened, and I\'m telling you about it',
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      499,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }

  function respondWithPasswordTooShortError(xhr){
    var response = {
      status: 400,
      code: 2007,
      userMessage: 'Account password minimum length not satisfied.',
      developerMessage: 'Account password minimum length not satisfied.',
      moreInfo: 'http://docs.stormpath.com/errors/2007',
      message: 'HTTP 400, Stormpath 2007 (http://docs.stormpath.com/errors/2007): Account password minimum length not satisfied.',
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      response.status,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }

  function respondWithPasswordRequiresUppercaseError(xhr){
    var response = {
      status: 400,
      code: 400,
      userMessage: 'Password requires an uppercase character!',
      developerMessage: 'Password requires an uppercase character!',
      moreInfo: 'mailto:support@stormpath.com',
      message: 'HTTP 400, Stormpath 400 (mailto:support@stormpath.com): Password requires an uppercase character!',
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      response.status,
      {'Content-Type': 'application/json'},
      JSON.stringify(response)
    );
  }

  function respondWithPasswordRequiresNumberError(xhr){
    var response = {
      status: 400,
      code: 400,
      userMessage: 'Password requires a numeric character!',
      developerMessage: 'Password requires a numeric character!',
      moreInfo: 'mailto:support@stormpath.com',
      message: 'HTTP 400, Stormpath 400 (mailto:support@stormpath.com): Password requires a numeric character!',
      'csrfToken': uuid(),
      'hpValue': uuid(),
      'expires': new Date().getTime() + (1000 * 60 * 5 ) //5 minutes
    };
    xhr.respond(
      response.status,
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
      // use '3' for account not found
      var niceError = '{"type":"basic","value":"NDo0"}'; // use '4' for some other error

      if(xhr.requestBody===validLogin){
        respondWithLoginSuccess('https://api.stormpath.com/v1/applications/1234',xhr);
      }else if(xhr.requestBody===badLogin){
        respondWithLoginFailure(xhr);
      }else if(xhr.requestBody===niceError){
        respondWithOtherError(xhr);
      }else{
        respondWithUserNotFound(xhr);
      }

    }

  );

  server.respondWith(
    'POST',
    'https://api.stormpath.com/v1/applications/1234/accounts',
    function(xhr){
      var data = JSON.parse(xhr.requestBody);
      if(xhr.requestBody.match(/stormpath/)){
        respondWithDuplicateUser(xhr);
      }else if(data.password.length===1){
        respondWithPasswordTooShortError(xhr);
      }else if(!data.password.match(/[A-Z]+/)){
        respondWithPasswordRequiresUppercaseError(xhr);
      }else if(!data.password.match(/[0-9]+/)){
        respondWithPasswordRequiresNumberError(xhr);
      }else if(xhr.requestBody.match(/499/)){
        respondWithOtherError(xhr);
      }else{
        var verified = xhr.requestBody.match(/verified/) !== null;
        respondWithNewAccount(JSON.parse(xhr.requestBody),verified,xhr);
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