'use strict';

describe('Service: sCastles', function () {

  // load the service's module
  beforeEach(module('metacastleApp'));

  // instantiate service
  var sCastles;
  beforeEach(inject(function (_sCastles_) {
    sCastles = _sCastles_;
  }));

  it('should do something', function () {
    expect(!!sCastles).toBe(true);
  });

});
