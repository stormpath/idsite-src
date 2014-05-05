'use strict';

describe('Controller: SsoLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var SsoLoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SsoLoginCtrl = $controller('SsoLoginCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
