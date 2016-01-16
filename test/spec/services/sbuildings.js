'use strict';

describe('Service: sBuildings', function () {

  // load the service's module
  beforeEach(module('metacastleApp'));

  // instantiate service
  var sBuildings;
  beforeEach(inject(function (_sBuildings_) {
    sBuildings = _sBuildings_;
  }));

  it('should do something', function () {
    expect(!!sBuildings).toBe(true);
  });

});
