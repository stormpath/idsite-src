'use strict';

describe('Controller: ErrorCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var ErrorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrorCtrl = $controller('ErrorCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
