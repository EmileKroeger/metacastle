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
      // right-iased crenelation
      this.tl = topleft + 204;
      this.tm = topleft + 205;
      this.tr = topleft + 206;
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
    
    function addTile(x, y, tilecode) {
      tiles[[x, y]] = tilecode;
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
      for (var dx = 1; dx < wid; dx++) {
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
    
    function addTower(x, y, wid, hei, platform) {
      addRect(x, y, wid, hei, BLUEWALLS);
      addRect(x, y + hei - 1, wid, platform, BLUECRENELATION);
    }
    
    addTower(4, 17, 20, 5, 3);
    addTower(3, 16, 5, 10, 4);
    addTower(22, 16, 5, 10, 4);
    
    addTower(4, 3, 3, 3, 17);
    addTower(23, 3, 3, 3, 17);
    addTower(4, 3, 20, 5, 3);
    addTower(3, 2, 5, 10, 4);
    addTower(22, 2, 5, 10, 4);

    /*
    addRect(9, 6, 12, 6, BLUEWALLS);
    addRect(9, 11, 12, 3, BLUECRENELATION);
    addRect(5, 5, 5, 10, BLUEWALLS);
    addRect(5, 13, 5, 5, BLUECRENELATION);
    addRect(20, 5, 5, 10, BLUEWALLS);
    addRect(20, 13, 5, 5, BLUECRENELATION);
    */

    $scope.getCastleTile = function(x, y) {
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
