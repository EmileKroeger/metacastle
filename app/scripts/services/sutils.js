'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sGarden
 * @description
 * # sGarden
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
.service('sUtils', function () {
  var sUtils = this;
  this.range = function(count) {
      return Array.apply(0, Array(count))
                  .map(function (element, index) { 
                           return index;  
                       });
  }
  self = this;
  this.tilePos = function tilePos(tilecode) {
    var ti = tilecode % 100;
    var tj = Math.floor((tilecode - ti) / 100);
    return "-" + (17 * ti) + "px -" + (17 * tj) + "px";
  }
  this.getStyle = function(i, j, tilecode) {
    var style = {
      left: (16 * i) + 'px',
      top: (16 * j) + 'px',
      "background-position": self.tilePos(tilecode),
    };
    return style;
  };
  this.mod = function(n, m) {
    // Fix Javascript's broken modulo.
    return ((n % m) + m) % m;
  };
  this.modGet = function(array, index) {
    // Get in a "circular array" (i.e. get with modulo, python-style))
    return array[this.mod(index, array.length)];
  };
  this.pseudoRandomInt = function(max, key) {
    // TODO: maybe use the key or something, some day.
    return Math.floor(Math.random() * max);
  };

  this.choice = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // Geometry utils
  // Helper for getting lines
  this.forInside = function(a, b, callback) {
    // Helper, returns all values strictly between a and b.
    if (a > b) {
      var tmp = b;
      b = a;
      a = tmp;
    }
    for (var n = a + 1; n < b; n++) {
      callback(n);
    }
  }
  function getDirectionCode(ptA, ptB) {
    // returns u, d, l or r for up, down, left, right
    // Assume same column or same row
    var xA = ptA[0];
    var yA = ptA[1];
    var xB = ptB[0];
    var yB = ptB[1];
    if (xA == xB) {
      if (yA < yB) {
        return "u";
      } else {
        return "d";
      }
    } else {
      if (xA < xB) {
        return "r";
      } else {
        return "l";
      }
    }
  }

  this.getAngleCode = function(path, index) {
    // Returns ul for "up-then-left angle", etc.
    var prev = sUtils.modGet(path, index -1);
    var cur = sUtils.modGet(path, index);
    var next = sUtils.modGet(path, index + 1);
    return getDirectionCode(prev, cur) + getDirectionCode(cur, next);
  };
  
  this.forEdgeTiles = function(path, callback) {
    // Iterate over all tiles on given path
    path.forEach(function(point, i) {
      var cx = point[0];
      var cy = point[1];
      // Handle corner
      callback(cx, cy, sUtils.getAngleCode(path, i));
      // Handle all points between prev and this
      var prev = sUtils.modGet(path, i - 1);
      var px = prev[0];
      var py = prev[1];
      if (px == cx) {
        var angleCode = "dd";
        if (py < cy) {
          var angleCode = "uu";
        }
        sUtils.forInside(py, cy, function(y) {
          callback(cx, y, angleCode);
        });
      } else {
        // py == cy can be assumed
        var angleCode = "ll";
        if (px < cx) {
          var angleCode = "rr";
        }
        sUtils.forInside(px, cx, function(x) {
          callback(x, cy, angleCode);
        });
      }
    });
  };
  this.getInsideOffset = function(angleCode) {
    // Given the angle type, get a point that's inside.
    if (angleCode[1] == "r") {
      return {dx: 1, dy: -1};
    } else if (angleCode[1] == "l") {
      return {dx: -1, dy: 1};
    } else if (angleCode[1] == "u") {
      return {dx: 1, dy: 1};
    } else {
      return {dx: -1, dy: -1};
    }
  };
  this.forTilesInside = function(path, callback) {
    // Iter inside given path
    var filled = {};
    function fill(poscode, angleCode) {
      if (filled[poscode]) {
        return false;
      } else {
        filled[poscode] = true;
        var x = poscode % 100;
        var y = Math.floor((poscode - x) / 100);
        callback(x, y, angleCode);
        return true;
      }
    }
    
    var firstpoint = null;
    sUtils.forEdgeTiles(path, function(x, y, angleCode) {
      fill(x + 100 * y, angleCode);
      if (!firstpoint) {
        // Find a point guaranteed to be inside
        var offset = sUtils.getInsideOffset(angleCode);
        firstpoint = (x + offset.dx) + 100 *(y + offset.dy);
      }
    });

    // Now, flood-fill the rest
    //var firstpoint = path[0][0] + 1 + 100 * (path[0][1] - 1);
    var border = [firstpoint];
    while (border.length > 0) {
      var point = border.pop();
      if (fill(point, "mm")) {
        // Add all neighbours to border
        border.push(point - 1);
        border.push(point + 1);
        border.push(point - 100);
        border.push(point + 100);
      }
      // else, already filled, do nothing
    }
  };
  this.nibble = function(rect) {
      //Make a slightly smaller rectangl
      return {
        x: rect.x + 1,
        y: rect.y + 1,
        wid: rect.wid - 2,
        hei: rect.hei - 2,
      };
    }

})