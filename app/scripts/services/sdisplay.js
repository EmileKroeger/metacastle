'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sDisplay
 * @description
 * # sDisplay
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
  var ANGLE_TO_TILE = {
    "uu": "ml",
    "ur": "tl",
    "ul": "in_tr",
    "dd": "mr",
    "dr": "in_bl",
    "dl": "br",
    "rr": "tm",
    "ru": "in_br",
    "rd": "tr",
    "ll": "bm",
    "lu": "bl",
    "ld": "in_tl",
  }
  // Helper for figuring out tile codess
  this.getPointCode = function(path, index) {
    var prev = sUtils.modGet(path, index -1);
    var cur = sUtils.modGet(path, index);
    var next = sUtils.modGet(path, index + 1);
    var angleCode = getDirectionCode(prev, cur) +
        getDirectionCode(cur, next);
        return ANGLE_TO_TILE[angleCode];
  };
})
.service('sDisplay', function () {
  this.tiles = [];

  this.addTile = function addTile(x, y, tilecode) {
    this.tiles.push({
      x: x,
      y: y,
      tilecode: tilecode,
    });
  }

  this.fillRect = function fillRect(x0, y0, wid, hei, tilecode) {
    for (var x=x0; x < x0 + wid; x++) {
      for (var y=y0; y < y0 + hei; y++) {
        this.addTile(x, y, tilecode);
      }
    }
  }
  
})
.service('sMaterials', function (sDisplay, sUtils) {
  // Helper function, only for materials of a certain kind.
  function addRect(x0, y0, wid, hei, mat) {
    // Fills in a rectangle with a special material.
    var x1 = x0 + wid - 1;
    var y1 = y0 + hei - 1;
    // Left column
    sDisplay.addTile(x0, y0+0, mat.bl);
    for (var dy = 1; dy < hei - 1; dy++) {
      sDisplay.addTile(x0, y0+dy, mat.ml);
    }
    sDisplay.addTile(x0, y1, mat.tl);
    // Middle
    for (var dx = 1; dx < wid - 1; dx++) {
      sDisplay.addTile(x0+dx, y0+0, mat.bm);
      for (var dy = 1; dy < hei - 1; dy++) {
        sDisplay.addTile(x0+dx, y0+dy, mat.mm);
      }
      sDisplay.addTile(x0+dx, y1, mat.tm);
    }
    // Right column
    sDisplay.addTile(x1, y0+0, mat.br);
    for (var dy = 1; dy < hei - 1; dy++) {
      sDisplay.addTile(x1, y0+dy, mat.mr);
    }
    sDisplay.addTile(x1, y1, mat.tr);
  }

  function castlePlatformMaterial(topleft) {
    // Crenelation
    this.tl = topleft + 2;
    this.tm = topleft + 3;
    this.tr = topleft + 4;
    // Alternative top, for crenelation
    this.tl_cut = topleft + 200;
    this.tr_cut = topleft + 201;
    // edges only
    this.ml = topleft + 102;
    this.mm = topleft + 103; // empy actually
    this.mr = topleft + 104;
    // Bottom crenelation
    this.bl = topleft + 202;
    this.bm = topleft + 203;
    this.br = topleft + 204;
    // Inside angles
    this.in_tl = topleft;
    this.in_tr = topleft + 1;
    this.in_bl = topleft + 100;
    this.in_br = topleft + 101;
  }
  castlePlatformMaterial.prototype.fillRect = function(surface) {
    // TODO: better
    addRect(surface.x, surface.y, surface.wid, surface.hei, this);
  }
  castlePlatformMaterial.prototype.makeLeftEdge = function(x, y, hei) {
    sDisplay.fillRect(x, y, 1, hei, this.ml);
    sDisplay.addTile(x, y + hei, this.tl_cut);
  }
  castlePlatformMaterial.prototype.makeRightEdge = function(x, y, hei) {
    sDisplay.fillRect(x, y, 1, hei, this.mr);
    sDisplay.addTile(x, y + hei, this.tr_cut);
  }
  castlePlatformMaterial.prototype.drawEdge = function(path) {
    // Helper for tracking who's been filled
    var self = this;
    var filled = {};
    function fill(poscode) {
      if (filled[poscode]) {
        return false;
      } else {
        filled[poscode] = true;
        var x = poscode % 100;
        var y = Math.floor((poscode - x) / 100);

        sDisplay.addTile(x, y, self.mr);
        return true;
      }
    }
    
    // Now iterate on the borders
    var prev = path[path.length - 1];
    path.forEach(function(point, i) {
      
      var px = prev[0];
      var py = prev[1];
      var cx = point[0];
      var cy = point[1];
      var angleTileCode = sUtils.getPointCode(path, i);
      sDisplay.addTile(cx, cy, self[angleTileCode]);

      if (px == cx) {
        var edgeCode = self.mr;
        if (py < cy) {
          var edgeCode = self.ml;
        }
        sUtils.forInside(py, cy, function(y) {
          // TODO: get an extra parameter here
          sDisplay.addTile(cx, y, edgeCode);
          
        });
      } else {
        // py == cy can be assumed
        var edgeCode = self.bm;
        if (px < cx) {
          var edgeCode = self.tm;
        }
        sUtils.forInside(px, cx, function(x) {
          sDisplay.addTile(x, cy, edgeCode);
        });
      }
      prev = point;
    });
  };
  

  
  // TODO: add "FILL" and "partial fill left/right" methods.
  
  function castleWallMaterial(topleft) {
    // Use flat wall on top too
    this.tl = topleft + 304;
    this.tm = topleft + 305;
    this.tr = topleft + 306;
    // "non-cracked" wall
    this.ml = topleft + 304;
    this.mm = topleft + 305;
    this.mr = topleft + 306;
    // Bottom joins ground
    this.bl = topleft + 301;
    this.bm = topleft + 300;
    this.br = topleft + 303;
  }
  castleWallMaterial.prototype.fillRect = function(surface) {
    // TODO: better
    addRect(surface.x, surface.y, surface.wid, surface.hei, this);
  }
  
  this.YELLOWWALLS = new castleWallMaterial(1213);
  this.GREYWALLS = new castleWallMaterial(1220);
  this.BLUEWALLS = new castleWallMaterial(1227);
  this.BROWNWALLS = new castleWallMaterial(1234);
  //var GREYPLATFORM = new castlePlatformMaterial(1220);
  this.BLUECRENELATION = new castlePlatformMaterial(3127);
})
.service('sDecorations', function (sDisplay) {
  function SingleTile(tilecode){
    this.tilecode = tilecode;
  }
  SingleTile.prototype.render = function(x, y) {
    sDisplay.addTile(x, y, this.tilecode);
  }
  function WideTile(tilecode){
    this.tilecode = tilecode;
  }
  WideTile.prototype.render = function(x, y) {
    sDisplay.addTile(x, y, this.tilecode);
    sDisplay.addTile(x + 1, y, this.tilecode + 1);
  }
  function HighTile(bottomtilecode, height) {
    this.bottomtilecode = bottomtilecode;
    this.height = height;
  }
  HighTile.prototype.render = function(x, y) {
    for (var i = 0; i < this.height; i++) {
      sDisplay.addTile(x, y + i, this.bottomtilecode - (100 * i));
      
    }
  }
  
  // Windows
  this.greySlit = new SingleTile(845);
  this.greyCrossSlit = new SingleTile(844);
  this.greyRoundedWindow = new SingleTile(846)
  this.greyGothicWindow = new SingleTile(847)
  // Doors
  this.roundedWoodenDoor = new SingleTile(32);
  this.roundedWoodenGratedDoor = new SingleTile(33);
  this.squareSteelDoor = new SingleTile(232);
  this.squareSteelGratedDoor = new SingleTile(233);
  this.wideWoodenGate = new WideTile(528);
  this.wideSteelSquareGratedGate = new WideTile(638);
  // Banners
  this.tallRedBanner = new HighTile(249, 3);
  this.tallGreenBanner = new HighTile(849, 3);
  this.tallRedBannerCross = new HighTile(250, 3);
  // Trapdoors
  this.blueStairsDown = new SingleTile(1829);
  
})
.service('sDecorators', function (sDisplay) {

  function HighWindowsDecorator() {
  }
  HighWindowsDecorator.prototype.render = function(style, surface) {
    var x = surface.x + 1;
    var y = surface.y + surface.hei - 2;
    var x_max = surface.x + surface.wid - 2;
    while (x <= x_max) {
      style.window.render(x, y)
      x += 2;
    }
  };

  function TrapdoorDecorator() {
  }
  TrapdoorDecorator.prototype.render = function(style, surface) {
    if (surface.wid > 1) {
      var y = surface.y + Math.floor(surface.hei / 2) - 1;
      style.trapdoor.render(surface.x + 1, y);
    }
  };

  function GateDecorator() {
  }
  GateDecorator.prototype.render = function(style, surface) {
    if (surface.wid > 2) {
      var middleLeft = surface.x + Math.floor(surface.wid / 2.0) - 1;
      style.gate.render(middleLeft, surface.y);
    }
  }
  function FancyGateDecorator() {
  }
  FancyGateDecorator.prototype.render = function(style, surface) {
    var middleLeft = surface.x + Math.floor(surface.wid / 2.0) - 1;
    if (surface.wid > 2) {
      style.gate.render(middleLeft, surface.y);
      // Parallel banners
      style.tallBanner.render(middleLeft-1, surface.y + 2);
      style.tallBanner.render(middleLeft+2, surface.y + 2);
      style.window.render(middleLeft, surface.y + 3);
      style.window.render(middleLeft + 1, surface.y + 3);
    }
  }
  function WindowedGateDecorator() {
  }
  WindowedGateDecorator.prototype.render = function(style, surface) {
    var middleLeft = surface.x + Math.floor(surface.wid / 2.0) - 1;
    style.gate.render(middleLeft, surface.y);
    for (var y=surface.y + 1; y < surface.y + surface.hei; y += 2) {
      style.window.render(middleLeft - 1, y);
      style.window.render(middleLeft + 2, y);
    }
  }
  
  this.highWindowsDecorator = new HighWindowsDecorator();
  this.trapdoorDecorator = new TrapdoorDecorator();
  this.gateDecorator = new GateDecorator();
  this.fancyGateDecorator = new FancyGateDecorator();
  this.windowedGateDecorator = new WindowedGateDecorator();
});

