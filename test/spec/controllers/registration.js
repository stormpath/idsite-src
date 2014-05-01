'use strict';

describe('Controller: RegistrationCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var RegistrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegistrationCtrl = $controller('RegistrationCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
