'use strict';

describe('Service: sStyles', function () {

  // load the service's module
  beforeEach(module('metacastleApp'));

  // instantiate service
  var sStyles;
  beforeEach(inject(function (_sStyles_) {
    sStyles = _sStyles_;
  }));

  it('should do something', function () {
    expect(!!sStyles).toBe(true);
  });

});
