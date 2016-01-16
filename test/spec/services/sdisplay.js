'use strict';

describe('Service: sDisplay', function () {

  // load the service's module
  beforeEach(module('metacastleApp'));

  // instantiate service
  var sDisplay;
  beforeEach(inject(function (_sDisplay_) {
    sDisplay = _sDisplay_;
  }));

  it('should do something', function () {
    expect(!!sDisplay).toBe(true);
  });

});
