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

      ssoConfig: {
        href: appHref + '/ssoConfig',
        socialProviders: {
          googleClientId: '279686489820-bm1m1kd1dbdojvhmh4phhr6aofj95933.apps.googleusercontent.com',
          facebookAppId: '711511582223538'
        },
        password: {
          minLength: 0,
          maxLength: 255,
          lowerCase: true,
          upperCase: true,
          digit: true,
          diacrit: false
        },
        logoUrl: 'images/logo.png'
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


  function respondWithNotFound(xhr){
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

  function respondWithPasswordResetToken(email,xhr){
    var response = {
      status: 200,
      code: 200,
      href: 'https://api.stormpath.com/v1/applications/1h72PFWoGxHKhysKjYIkir/passwordResetTokens/QnKDpz3jxWYrnX9UzOStjgR5S6XBLyhEHRaUgpnKUUrb8GqWWGxcYC8CjcBCchKO3n0quuAZe9',
      email: 'robert@robertjd.com',
      account: { href: 'https://api.stormpath.com/v1/accounts/' + uuid() },
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
      var validLogin = '{"type":"basic","value":"cm9iZXJ0QHN0b3JtcGF0aC5jb206cm9iZXJ0QHN0b3JtcGF0aC5jb20="}'; // robert@stormpath.com , robert@stormpath.com
      var badLogin = '{"type":"basic","value":"cm9iZXJ0QHN0b3JtcGF0aC5jb206MQ=="}'; // robert@stormpath.com , 1
      // use '3' for account not found
      var niceError = '{"type":"basic","value":"NDk5OjQ5OQ=="}'; // 499 , 499

      if(xhr.requestBody===validLogin){
        respondWithLoginSuccess('https://api.stormpath.com/v1/applications/1234',xhr);
      }else if(xhr.requestBody===badLogin){
        respondWithLoginFailure(xhr);
      }else if(xhr.requestBody===niceError){
        respondWithOtherError(xhr);
      }else{
        respondWithNotFound(xhr);
      }

    }

  );


  server.respondWith(
    'POST',
    'https://api.stormpath.com/v1/applications/1234/accounts',
    function(xhr){
      var data = JSON.parse(xhr.requestBody);
      var p = data.password;
      if(xhr.requestBody.match(/stormpath/)){
        respondWithDuplicateUser(xhr);
      }else if(p && p.length===1){
        respondWithPasswordTooShortError(xhr);
      }else if(p && !p.match(/[A-Z]+/)){
        respondWithPasswordRequiresUppercaseError(xhr);
      }else if(p && !p.match(/[0-9]+/)){
        respondWithPasswordRequiresNumberError(xhr);
      }else if(xhr.requestBody.match(/499/)){
        respondWithOtherError(xhr);
      }else{
        var verified = xhr.requestBody.match(/verified|google|facebook/) !== null;
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

  server.respondWith(
    'GET',
    'https://api.stormpath.com/v1/tenants/current',
    function(xhr){
      var tenantId = Math.floor(Math.random()*100000);
      xhr.respond(
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify({
          href: 'https://api.stormpath.com/v1/tenants/'+tenantId
        })
      );
    }

  );

  server.respondWith(
    'POST',
    'https://api.stormpath.com/v1/accounts/emailVerificationTokens/1',
    function(xhr){
      respondWithNewAccount({
        email: 'joe@somebody.com'
      },true,xhr);
    }
  );

  server.respondWith(
    'POST',
    'https://api.stormpath.com/v1/accounts/emailVerificationTokens/2',
    function(xhr){
      respondWithNotFound(xhr);
    }
  );

  server.respondWith(
    'POST',
    'https://api.stormpath.com/v1/accounts/emailVerificationTokens/3',
    function(xhr){
      respondWithOtherError(xhr);
    }
  );

  server.respondWith(
    'GET',
    'https://api.stormpath.com/v1/applications/1234/passwordResetTokens/1',
    function(xhr){
      respondWithNewAccount({
        email: 'joe@somebody.com'
      },true,xhr);
    }
  );

  server.respondWith(
    'GET',
    'https://api.stormpath.com/v1/applications/1234/passwordResetTokens/2',
    function(xhr){
      respondWithNotFound(xhr);
    }
  );

  server.respondWith(
    'GET',
    'https://api.stormpath.com/v1/applications/1234/passwordResetTokens/3',
    function(xhr){
      respondWithOtherError(xhr);
    }
  );

  server.respondWith(
    'POST',
    'https://api.stormpath.com/v1/applications/1234/passwordResetTokens',
    function(xhr){
      var data = JSON.parse(xhr.requestBody);
      if(data.email.match(/robert@stormpath.com/)){
        respondWithPasswordResetToken(data.email,xhr);
      }else if(data.email.match(/499/)){
        respondWithOtherError(xhr);
      }else{
        respondWithNotFound(xhr);
      }
    }
  );

  server.respondWith(
    'POST',
    new RegExp('https://api.stormpath.com/v1/accounts/[0-9]+$'),
    function(xhr){
      var data = JSON.parse(xhr.requestBody);
      if(data.password.length===1){
        respondWithPasswordTooShortError(xhr);
      }else if(!data.password.match(/[A-Z]+/)){
        respondWithPasswordRequiresUppercaseError(xhr);
      }else if(!data.password.match(/[0-9]+/)){
        respondWithPasswordRequiresNumberError(xhr);
      }else if(xhr.requestBody.match(/499/)){
        respondWithOtherError(xhr);
      }else{
        respondWithNewAccount(JSON.parse(xhr.requestBody),true,xhr);
      }
    }
  );

  server.autoRespond = true;
  server.autoRespondAfter = 200;
  return server;

}

window.fakeserver = new MockStormpath();