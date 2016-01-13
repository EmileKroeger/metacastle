'use strict';
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
  .controller('MainCtrl', function ($scope, sUtils) {
    $scope.range = sUtils.range;
    $scope.getTilemapTile = function(x, y) {
      // Return the tile code from the same place
      return 100 * (30 - y) + x;
    }
    $scope.CASTLEWID = 30;
    $scope.CASTLEHEI = 30;
    
    var tiles = {};
    
    function castlePlatformMaterial(topleft) {
      // Crenelation again
      this.tl = topleft + 1901;
      this.tm = topleft + 1902;
      this.tr = topleft + 1903;
      // And flattish
      this.ml = topleft + 2001;
      this.mm = topleft + 2002;
      this.mr = topleft + 2003;
      // Same as above (for now)
      this.bl = topleft + 2101;
      this.bm = topleft + 2102;
      this.br = topleft + 2103;
    }
    
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
      this.bl = topleft + 301;
      this.bm = topleft + 300;
      this.br = topleft + 303;
    }
    
    var YELLOWWALLS = new castleWallMaterial(1213);
    var GREYWALLS = new castleWallMaterial(1220);
    var BLUEWALLS = new castleWallMaterial(1227);
    var BROWNWALLS = new castleWallMaterial(1234);
    //var GREYPLATFORM = new castlePlatformMaterial(1220);
    var BLUECRENELATION = new castlePlatformMaterial(1227);
    
    $scope.extraTiles = [];
    function addTile(x, y, tilecode) {
      tiles[[x, y]] = tilecode;
      $scope.extraTiles.push({
        x: x,
        y: y,
        tilecode: tilecode,
      });
    }

    function fillRect(x0, y0, wid, hei, tilecode) {
      for (var x=x0; x < x0 + wid; x++) {
        for (var y=y0; y < y0 + hei; y++) {
          addTile(x, y, tilecode);
        }
      }
    }
    
    function addRect(x0, y0, wid, hei, kind) {
      var x1 = x0 + wid - 1;
      var y1 = y0 + hei - 1;
      // Left column
      addTile(x0, y0+0, kind.bl);
      for (var dy = 1; dy < hei - 1; dy++) {
        addTile(x0, y0+dy, kind.ml);
      }
      addTile(x0, y1, kind.tl);
      // Middle
      for (var dx = 1; dx < wid - 1; dx++) {
        addTile(x0+dx, y0+0, kind.bm);
        for (var dy = 1; dy < hei - 1; dy++) {
          addTile(x0+dx, y0+dy, kind.mm);
        }
        addTile(x0+dx, y1, kind.tm);
      }
      // Right column
      addTile(x1, y0+0, kind.br);
      for (var dy = 1; dy < hei - 1; dy++) {
        addTile(x1, y0+dy, kind.mr);
      }
      addTile(x1, y1, kind.tr);
    }
    
    function addBuilding(x, y, wid, hei, platform) {
      // Wall
      addRect(x, y, wid, hei - 1, BLUEWALLS);
      // Platform tiles
      fillRect(x, y + hei - 1, wid, platform - 1, 9);
      // Crenelation
      addRect(x, y + hei - 1, wid, platform, BLUECRENELATION);
    }
    
    function thinTower(cx, cy, hei) {
      addBuilding(cx - 2, cy - 2, 5, hei, 4);
    }
    
    function horizontalWall(cxl, cy, cxr, hei) {
      addBuilding(cxl+2, cy - 1, cxr - cxl-2, hei, 3);
    }
    function OLDverticalWall(cx, cyb, cyt, hei) {
      addBuilding(cx-1, cyb + 1, 3, hei, cyt - cyb - 2);
    }
    function verticalWall(cx, cyb, cyt, hei) {
      var y = cyb + hei;
      var wid = 3;
      var platform = cyt - cyb - 2;
      fillRect(cx - 1, y, wid, platform - 1, 9);
      // BlueCrenelation
      //addRect(cx - 1, y, wid, platform, BLUECRENELATION);
      // Left crenelation
      fillRect(cx - 1, y, 1, platform - 1, 3228); // Left crenelation
      addTile(cx - 1, y + platform - 1, 3131);
      fillRect(cx + 1, y, 1, platform - 1, 3230); // Right crenelation
      addTile(cx + 1, y + platform - 1, 3133);
    }
    
    // Ground
    
    fillRect(5, 4, 20, 15, 106) // Dirt
    
    // Back wall
    horizontalWall(5, 18, 24, 5)
    // Back towers
    thinTower(5, 18, 10);
    thinTower(24, 18, 10);
    
    verticalWall(5, 4, 18, 5)
    verticalWall(24, 4, 18, 5)

    horizontalWall(5, 4, 24, 5)
    thinTower(5, 4, 10);
    thinTower(24, 4, 10);
    
    addBuilding(10, 13, 10, 8, 7);
    addBuilding(13, 22, 4, 4, 4);

    // Gates
    addTile(14, 3, 632);
    addTile(15, 3, 633);

    /*
    addRect(9, 6, 12, 6, BLUEWALLS);
    addRect(9, 11, 12, 3, BLUECRENELATION);
    addRect(5, 5, 5, 10, BLUEWALLS);
    addRect(5, 13, 5, 5, BLUECRENELATION);
    addRect(20, 5, 5, 10, BLUEWALLS);
    addRect(20, 13, 5, 5, BLUECRENELATION);
    */

    $scope.getCastleTile = function(x, y) {
      if (true) {
        return 5
      }
      var tile = tiles[[x, y]];
      if (tile) {
        return tile;
      } else {
        return 0;
      }
      if (x < 10) {
        return 0;
      }
      else if (x < 20) {
        return 1424;
      }
      return 0;
    }
    
    $scope.getStyle = sUtils.getStyle;
  });
