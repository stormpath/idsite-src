'use strict';

describe('Controller: ErrorCtrl', function () {

  // load the controller's module
  beforeEach(module('stormpathIdpApp'));

  var ErrorCtrl,
    scope;

  var stormpath = {
    errors: []
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrorCtrl = $controller('ErrorCtrl', {
      $scope: scope,
      Stormpath: stormpath
    });
  }));

  it('should observe new errors and set inError to true', function () {
    var anError = 'an error';
    stormpath.errors.push(anError);
    expect(scope.errors[0]).to.equal(anError);
    scope.$digest();
    expect(scope.inError).to.equal(true);
  });
});
