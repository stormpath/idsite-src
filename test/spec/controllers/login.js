'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope,$location) {
    scope = $rootScope.$new();
    $location.search('access_token','1234');
    $location.search('application_href','http://api.stormpath.com/v1/applications/1234');
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function () {
    expect(true).to.equal(true);
  });
});
