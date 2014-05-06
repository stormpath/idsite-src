'use strict';

describe('Controller: RegistrationFormCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var RegistrationFormCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegistrationFormCtrl = $controller('RegistrationFormCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
