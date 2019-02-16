'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sDisplay
 * @description
 * # sDisplay
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')

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
  
  this.clear = function() {
    this.tiles.length = 0;
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
  
  function EdgeAndTileMaterial(edgeMaterial, tilecode) {
    this.edgeMaterial = edgeMaterial;
    this.tilecode = tilecode;
  }
  EdgeAndTileMaterial.prototype.fillPath = function(path) {
    // Fill inside given path
    var self = this;
    sUtils.forTilesInside(path, function(x, y, angleCode) {
      sDisplay.addTile(x, y, self.tilecode);
      sDisplay.addTile(x, y, self.edgeMaterial[ANGLECODE_TO_TILEPOS[angleCode]]);
    });
  };
  
  function PointyRoofMaterial(topleftcode) {
    this.tl = topleftcode;
    this.ml = topleftcode + 100;
    this.bl = topleftcode + 200;
    this.tr = topleftcode + 1;
    this.mr = topleftcode + 101;
    this.br = topleftcode + 201;
  }
  PointyRoofMaterial.prototype.fillRect = function(surface) {
    if (surface.wid != 2) {
      throw new Error("Unexpected width: " + surface.wid)
    }
    sDisplay.addTile(surface.x, surface.y, this.bl);
    sDisplay.addTile(surface.x + 1, surface.y, this.br);
    var topY = surface.y + surface.hei - 1;
    for (var y = surface.y + 1; y < topY; y++) {
      sDisplay.addTile(surface.x, y, this.ml);
      sDisplay.addTile(surface.x + 1, y, this.mr);
    }
    sDisplay.addTile(surface.x, topY, this.tl);
    sDisplay.addTile(surface.x + 1, topY, this.tr);
  }
  
  function FlattishRoofMaterial(topleftcode) {
    this.tl = topleftcode + 2;
    this.ml = topleftcode + 100;
    this.bl = topleftcode + 202;
    this.tr = topleftcode + 3;
    this.mr = topleftcode + 101;
    this.br = topleftcode + 203;
  }
  FlattishRoofMaterial.prototype.fillRect = function(surface) {
    if (surface.wid != 2) {
      throw new Error("Unexpected width: " + surface.wid)
    }
    sDisplay.addTile(surface.x, surface.y, this.bl);
    sDisplay.addTile(surface.x + 1, surface.y, this.br);
    var topY = surface.y + surface.hei - 1;
    for (var y = surface.y + 1; y < topY; y++) {
      sDisplay.addTile(surface.x, y, this.ml);
      sDisplay.addTile(surface.x + 1, y, this.mr);
    }
    sDisplay.addTile(surface.x, topY, this.tl);
    sDisplay.addTile(surface.x + 1, topY, this.tr);
  }
  this.yellowPointyRoof = new PointyRoofMaterial(2113);
  this.brownPointyRoof = new PointyRoofMaterial(2120);
  this.bluePointyRoof = new PointyRoofMaterial(2127);
  this.beigePointyRoof = new PointyRoofMaterial(2134);
  this.yellowFlattishRoof = new FlattishRoofMaterial(2113);
  this.brownFlattishRoof = new FlattishRoofMaterial(2120);
  this.blueFlattishRoof = new FlattishRoofMaterial(2127);
  this.beigeFlattishRoof = new FlattishRoofMaterial(2134);

  
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
  this.YELLOWCRENELATION = new EdgedMaterial(3113);
  this.GREYCRENELATION = new EdgedMaterial(3120);
  this.BLUECRENELATION = new EdgedMaterial(3127);
  this.BROWNCRENELATION = new EdgedMaterial(3134);
  this.BLUEPLATFORM = new EdgeAndTileMaterial(this.BLUECRENELATION, 9);
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
      this.decorations[i].render(x, y);
    } else {
    }
  }
  
  // Windows
  this.greyGothicWindow = new SingleTile(847)
  this.greyPointyWindow = new SingleTile(840)
  this.greyAngledWindow = new SingleTile(842)
  this.greySquareWindow = new SingleTile(843)
  this.greyCrossSlit = new SingleTile(844);
  this.greySlit = new SingleTile(845);
  this.greyRoundedWindow = new SingleTile(846)
  this.greyRomanWindow = new SingleTile(848)
  this.yellowSlit = new SingleTile(945);
  this.yellowCrossSlit = new SingleTile(944);
  this.yellowRoundedWindow = new SingleTile(946)
  this.yellowGothicWindow = new SingleTile(947)
  // Doors
  this.roundedWoodenDoor = new SingleTile(32);
  this.roundedWoodenGratedDoor = new SingleTile(33);
  this.squareSteelDoor = new SingleTile(232);
  this.squareSteelGratedDoor = new SingleTile(233);
  this.wideWoodenGate = new WideTile(528);
  this.wideSteelSquareGratedGate = new WideTile(638);
  // Banners
  this.tallRedBanner = new HighTile(249, 3);
  this.tallBlueBanner = new HighTile(549, 3);
  this.tallGreenBanner = new HighTile(849, 3);
  this.tallRedBannerCross = new HighTile(250, 3);
  this.tallBlueBannerCross = new HighTile(550, 3);
  this.tallGreenBannerCross = new HighTile(850, 3);
  // Trapdoors
  this.yellowStairsDown = new SingleTile(1815);
  this.greyStairsDown = new SingleTile(1822);
  this.blueStairsDown = new SingleTile(1829);
  this.brownStairsDown = new SingleTile(1836);
  
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

  function SingleHighWindowDecorator() {
  }
  SingleHighWindowDecorator.prototype.render = function(style, surface) {
    var middleLeft = surface.x + Math.floor(surface.wid / 2.0);
    var y = surface.y + surface.hei - 2;
    style.window.render(middleLeft, y);
  };

  function HighWindowsDecorator(step) {
    this.step = step;
  }
  HighWindowsDecorator.prototype.render = function(style, surface) {
    var x = surface.x + 1;
    var y = surface.y + surface.hei - 2;
    var x_max = surface.x + surface.wid - 2;
    while (x <= x_max) {
      style.window.render(x, y);
      x += this.step;
    }
  };
  
  function BannersAndWindowsDecorators() {
  }
  BannersAndWindowsDecorators.prototype.render = function(style, surface) {
    var x = surface.x + 1;
    var y = surface.y + surface.hei - 2;
    var x_max = surface.x + surface.wid - 2;
    while (x <= x_max) {
      if ((x - x_max) % 2 == 0 ) {
        style.window.render(x, y);
      } else {
        style.basicTallBanner.render(x, y - 2);
      }
      x += 1;
    }
  };
  this.bannersAndWindowsDecorators = new BannersAndWindowsDecorators();

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
      style.fancyTallBanner.render(middleLeft-1, surface.y + 2);
      style.fancyTallBanner.render(middleLeft+2, surface.y + 2);
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
  
  function ManyWindowedGateDecorator() {
  }
  ManyWindowedGateDecorator.prototype.render = function(style, surface) {
    var middleLeft = surface.x + Math.floor(surface.wid / 2.0) - 1;
    style.gate.render(middleLeft, surface.y);
    for (var y=surface.y + 1; y < surface.y + surface.hei; y += 2) {
      var dx0 = (y==surface.y + 1) ? 1 : 0;
      for (var dx = dx0; (2 * dx) < surface.wid; dx++) {
        style.window.render(middleLeft - dx, y);
        style.window.render(middleLeft + 1 + dx, y);
      }
    }
  }
  this.manyWindowedGateDecorator = new ManyWindowedGateDecorator();
  
  function HouseDecorator() {
  }
  HouseDecorator.prototype.render = function(style, surface) {
    var doorX = sUtils.choice([0, 1]);
    sDisplay.addTile(surface.x + doorX, surface.y, 32);
    var windowtile = sUtils.choice([
      // Square brown windows
      444, 446, 142, 242,
      // Round brown windows
      44, 45, 46, 47, 48,
      // Shuttered window
      746,
    ]);
    if (surface.hei == 2) {
      sDisplay.addTile(surface.x+1-doorX, surface.y, windowtile);
    } else if (surface.hei == 3) {
      sDisplay.addTile(surface.x,   surface.y+1, windowtile);
      sDisplay.addTile(surface.x+1, surface.y+1, windowtile);
    } else {
      console.log("WARNING: height not handled, house will be empty.")
    }
    
  }
  this.houseDecorator = new HouseDecorator();
  
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
  
  this.singleHighWindowDecorator = new SingleHighWindowDecorator();
  this.manyHighWindowsDecorator = new HighWindowsDecorator(1);
  this.highWindowsDecorator = new HighWindowsDecorator(2);
  this.trapdoorDecorator = new TrapdoorDecorator();
  this.gateDecorator = new GateDecorator();
  this.fancyGateDecorator = new FancyGateDecorator();
  this.windowedGateDecorator = new WindowedGateDecorator();
  
  this.workDecorator = new StuffDecorator(11, sDecorations.workItems);
});

