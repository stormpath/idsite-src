'use strict';

describe('Service: Stormpath', function () {

  // load the service's module
  beforeEach(module('stormpathIdpApp'));

  // instantiate service
  var Stormpath;
  beforeEach(inject(function (_Stormpath_) {
    Stormpath = _Stormpath_;
  }));

  it('should do something', function () {
    expect(!!Stormpath).to.equal(true);
  });

});
