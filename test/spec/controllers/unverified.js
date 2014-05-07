'use strict';

describe('Controller: UnverifiedCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var UnverifiedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UnverifiedCtrl = $controller('UnverifiedCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
