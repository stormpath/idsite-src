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

  it('should set a fields object', function () {
    expect(typeof scope.fields).to.equal('object');
  });
});
