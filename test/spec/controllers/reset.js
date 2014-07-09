'use strict';

describe('Controller: ResetCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var ResetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResetCtrl = $controller('ResetCtrl', {
      $scope: scope,
      Stormpath: {
        init: {
          then: function(cb){cb();}
        },
        verifyPasswordToken: function(cb){
          // verification success
          cb(null);
        }
      }
    });
  }));

  it('should set scope.status to success', function () {
    expect(scope.status).to.equal('verified');
  });
});
