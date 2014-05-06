'use strict';

describe('Directive: nameValidation', function () {

  // load the directive's module
  beforeEach(module('stormpathIdpApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<div name-validation></div>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('');
  }));
});
