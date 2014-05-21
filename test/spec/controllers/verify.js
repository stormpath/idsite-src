'use strict';

describe('Controller: VerifyCtrl', function () {

  var stormpathFixture1 = {
    init: {
      // dont callback on init, so that we can assert initial controller state
      then: function(){}
    }
  };

  var stormpathFixture2 = {
    // verification success
    init: {
      then: function(cb){cb();}
    },
    verifyEmailToken: function(token,cb){
      cb(null);
    }
  };

  var stormpathFixture3 = {
    // verification failure with generic error object
    init: {
      then: function(cb){cb();}
    },
    verifyEmailToken: function(token,cb){
      cb(new Error('an error'));
    }
  };

  beforeEach(module('stormpathIdpApp'));

  describe('initial state',function(){
    var VerifyCtrl, scope;
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      VerifyCtrl = $controller('VerifyCtrl', {
        $scope: scope,
        Stormpath: stormpathFixture1
      });
    }));
    it('should begin with status loading', function () {
      expect(scope.status).to.equal('loading');
    });
  });


  describe('with a valid token',function(){
    var VerifyCtrl, scope;
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      VerifyCtrl = $controller('VerifyCtrl', {
        $scope: scope,
        Stormpath: stormpathFixture2
      });
    }));
    it('should have status of verified', function () {
      expect(scope.status).to.equal('verified');
    });
  });

  describe('with a invalid token',function(){
    var VerifyCtrl, scope;
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      VerifyCtrl = $controller('VerifyCtrl', {
        $scope: scope,
        Stormpath: stormpathFixture3
      });
    }));

    it('should have status failed if an error is returned', function () {
      expect(scope.status).to.equal('failed');
    });
  });

  describe('with a generic error result',function(){
    var VerifyCtrl, scope;
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      VerifyCtrl = $controller('VerifyCtrl', {
        $scope: scope,
        Stormpath: stormpathFixture3
      });
    }));

    it('should put the error string onto scope.error', function () {
      expect(scope.error).to.equal('an error');
    });
  });

});
