'use strict';

describe('Controller: ResetCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var ResetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    $location.search('access_token','1234');
    $location.search('application_href','http://api.stormpath.com/v1/applications/1234');
    scope = $rootScope.$new();
    ResetCtrl = $controller('ResetCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
