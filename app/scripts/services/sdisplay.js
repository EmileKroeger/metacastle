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
  this.pseudoRandomInt = function(max, key) {
    // TODO: maybe use the key or something, some day.
    return Math.floor(Math.random() * max);
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
  
  // Helper table
  var ANGLECODE_TO_TILEPOS = {
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
    "mm": "mm",
  };
  

  function EdgedMaterial(topleft, inside_offset) {
    // Crenelation
    this.tl = topleft + 2;
    this.tm = topleft + 3;
    this.tr = topleft + 4;
    // Alternative top, for crenelation
    this.tl_cut = topleft + 200;
    this.tr_cut = topleft + 201;
    // edges only
    this.ml = topleft + 102;
    this.mm = topleft + 103; // sometimes empty
    this.mr = topleft + 104;
    // Bottom crenelation
    this.bl = topleft + 202;
    this.bm = topleft + 203;
    this.br = topleft + 204;
    // Inside angles
    if (!inside_offset) {
      inside_offset = 0;
    }
    this.in_tl = topleft + inside_offset;
    this.in_tr = topleft + inside_offset + 1;
    this.in_bl = topleft + inside_offset + 100;
    this.in_br = topleft + inside_offset + 101;
  }
  
  function getRectanglePath(surface) {
    return [
      [surface.x, surface.y],
      [surface.x, surface.y + surface.hei],
      [surface.x + surface.wid, surface.y + surface.hei],
      [surface.x + surface.wid, surface.y],
    ];
  }
  
  EdgedMaterial.prototype.fillRect = function(surface) {
    // TODO: better
    addRect(surface.x, surface.y, surface.wid, surface.hei, this);
  }
  EdgedMaterial.prototype.makeLeftEdge = function(x, y, hei) {
    sDisplay.fillRect(x, y, 1, hei, this.ml);
    sDisplay.addTile(x, y + hei, this.tl_cut);
  }
  EdgedMaterial.prototype.makeRightEdge = function(x, y, hei) {
    sDisplay.fillRect(x, y, 1, hei, this.mr);
    sDisplay.addTile(x, y + hei, this.tr_cut);
  }

  EdgedMaterial.prototype.drawEdge = function(path) {
    // Draw special border along edge
    var self = this;
    sUtils.forEdgeTiles(path, function(x, y, angleCode) {
      sDisplay.addTile(x, y, self[ANGLECODE_TO_TILEPOS[angleCode]]);
    });
  };

  EdgedMaterial.prototype.fillPath = function(path) {
    // Fill inside given path
    var self = this;
    sUtils.forTilesInside(path, function(x, y, angleCode) {
      sDisplay.addTile(x, y, self[ANGLECODE_TO_TILEPOS[angleCode]]);
    });
  };

  
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
  this.BLUECRENELATION = new EdgedMaterial(3127);
  this.WATER_DIRT = new EdgedMaterial(0, 100);
  this.WATER_STONE = new EdgedMaterial(300);
  this.REDFLOWERS = new EdgedMaterial(600);
  this.WHITEFLOWERS = new EdgedMaterial(900);
  this.BLUEFLOWERS = new EdgedMaterial(1200);
  this.GRASS = new EdgedMaterial(1500);
  this.DIRT = new EdgedMaterial(905);
  this.STONE = new EdgedMaterial(1505);
  this.SAND = new EdgedMaterial(2105);
  
  // TODO: some fancy materials that actually display random tiles.
  // We have those for dirt, water, sand, walls...
})
.service('sDecorations', function (sDisplay, sUtils) {
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
  
  function RandomDecoration(empties, decorations) {
    this.total = empties + decorations.length;
    this.decorations = decorations;
  }
  RandomDecoration.prototype.render = function(x, y) {
    var i = sUtils.pseudoRandomInt(this.total, x + y + x*y);
    if (i < this.decorations.length) {
      //console.debug([i]);
      this.decorations[i].render(x, y);
    } else {
      //console.debug(["no", i]);
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
  
  // Misc. Items
  this.anvil = new SingleTile(15);
  this.sign = new SingleTile(19);
  this.woodbarrel = new SingleTile(22);
  this.bandedbarrel = new SingleTile(23);
  this.woodbarrel_open = new SingleTile(25);
  this.bandedbarrel_open = new SingleTile(26);
  this.stump1 = new SingleTile(2053);
  this.stump2 = new SingleTile(1953);
  this.stump_axe = new SingleTile(2153);
  this.woodpile = new SingleTile(2253);
  
  this.workItems = [
    this.anvil, this.sign, this.woodbarrel, this.bandedbarrel,
    this.woodbarrel_open, this.bandedbarrel_open, this.woodpile,
  ]
  this.randomWorkItem = new RandomDecoration(32, this.workItems);
})
.service('sDecorators', function (sDisplay, sDecorations, sUtils) {

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
  
  function StuffDecorator(empties, decorations) {
    this.total = empties + decorations.length;
    this.decorations = decorations;
  }
  StuffDecorator.prototype.render = function(style, surface) {
    for(var x=surface.x; x < surface.x + surface.wid; x++) {
      for(var y=surface.y; y < surface.y + surface.hei; y++) {
        var i = sUtils.mod(x + 2 * y + 3 * (x * y), this.total);
        if (i < this.decorations.length) {
          this.decorations[i].render(x, y);
        }
      }
    }
  }
  
  this.highWindowsDecorator = new HighWindowsDecorator();
  this.trapdoorDecorator = new TrapdoorDecorator();
  this.gateDecorator = new GateDecorator();
  this.fancyGateDecorator = new FancyGateDecorator();
  this.windowedGateDecorator = new WindowedGateDecorator();
  
  this.workDecorator = new StuffDecorator(11, sDecorations.workItems);
});

