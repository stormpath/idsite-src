'use strict';

describe('Controller: VerifyCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var VerifyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VerifyCtrl = $controller('VerifyCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
