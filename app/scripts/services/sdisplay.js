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
  
  this.addRect = function addRect(x0, y0, wid, hei, kind) {
    // Fills in a rectangle with a special material.
    var x1 = x0 + wid - 1;
    var y1 = y0 + hei - 1;
    // Left column
    this.addTile(x0, y0+0, kind.bl);
    for (var dy = 1; dy < hei - 1; dy++) {
      this.addTile(x0, y0+dy, kind.ml);
    }
    this.addTile(x0, y1, kind.tl);
    // Middle
    for (var dx = 1; dx < wid - 1; dx++) {
      this.addTile(x0+dx, y0+0, kind.bm);
      for (var dy = 1; dy < hei - 1; dy++) {
        this.addTile(x0+dx, y0+dy, kind.mm);
      }
      this.addTile(x0+dx, y1, kind.tm);
    }
    // Right column
    this.addTile(x1, y0+0, kind.br);
    for (var dy = 1; dy < hei - 1; dy++) {
      this.addTile(x1, y0+dy, kind.mr);
    }
    this.addTile(x1, y1, kind.tr);
  }
})
.service('sMaterials', function (sDisplay) {
  function castlePlatformMaterial(topleft) {
    // Crenelation
    this.tl = topleft + 1901;
    this.tm = topleft + 1902;
    this.tr = topleft + 1903;
    // Alternative top, for crenelation
    this.tl_cut = topleft + 1904;
    this.tr_cut = topleft + 1906;
    // edges only
    this.ml = topleft + 2001;
    this.mm = topleft + 2002; // empy actually
    this.mr = topleft + 2003;
    // Bottom crenelation
    this.bl = topleft + 2101;
    this.bm = topleft + 2102;
    this.br = topleft + 2103;
  }
  // TODO: add "FILL" and "partial fill left/right" methods.
  
  function castleWallMaterial(topleft) {
    // right-biased crenelation
    //this.tl = topleft + 204;
    //this.tm = topleft + 205;
    //this.tr = topleft + 206;
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
  
  this.YELLOWWALLS = new castleWallMaterial(1213);
  this.GREYWALLS = new castleWallMaterial(1220);
  this.BLUEWALLS = new castleWallMaterial(1227);
  this.BROWNWALLS = new castleWallMaterial(1234);
  //var GREYPLATFORM = new castlePlatformMaterial(1220);
  this.BLUECRENELATION = new castlePlatformMaterial(1227);
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
  
  this.wideWoodenGate = new WideTile(528);
})
.service('sDecorators', function (sDisplay) {

  // WIP POC of facade decorator:
  function HighWindowsDecorator() {
  }
  HighWindowsDecorator.prototype.render = function(style, surface) {
    var x = surface.x + 1;
    var y = surface.y + surface.hei - 2;
    var x_max = surface.x + surface.wid - 2;
    while (x <= x_max) {
      sDisplay.addTile(x, y, style.window)
      x += 2;
    }
  };

  function TrapdoorDecorator() {
  }
  TrapdoorDecorator.prototype.render = function(style, surface) {
    if (surface.wid > 1) {
      sDisplay.addTile(surface.x + 1, surface.y + 0, style.trapdoor);
    }
  };
  
  this.highWindowsDecorator = new HighWindowsDecorator();
  this.trapdoorDecorator = new TrapdoorDecorator();
});

