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
  .service('sMaterials', function () {
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
  .controller('MainCtrl', function ($scope, sUtils, sMaterials) {
    $scope.range = sUtils.range;
    $scope.getTilemapTile = function(x, y) {
      // Return the tile code from the same place
      return 100 * (30 - y) + x;
    }
    $scope.CASTLEWID = 30;
    $scope.CASTLEHEI = 30;
    
    $scope.tiles = [];
    function addTile(x, y, tilecode) {
      $scope.tiles.push({
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
      // Fills in a rectangle with a special material.
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
    
    function addBuilding(style, x, y, wid, hei, platform) {
      // Wall
      addRect(x, y, wid, hei - 1, style.wallMaterial);
      // Platform tiles
      fillRect(x, y + hei - 1, wid, platform - 1, style.platformTile);
      // Crenelation
      addRect(x, y + hei - 1, wid, platform, style.crenelationMaterial);
    }
    
    function thinTower(style, cx, cy) {
      var hei = style.towerHeight;
      addBuilding(style, cx - 2, cy - 2, 5, hei, 4);
      addTile(cx, cy + hei - 2, style.trapdoor)
      addTile(cx, cy + hei - 5, style.window)
    }
    
    function horizontalCurtainWall(style, cxl, cy, cxr) {
      var hei = style.curtainWallHeight;
      addBuilding(style, cxl+2, cy - 1, cxr - cxl-2, hei, 3);
    }
    function gatedHorizontalCurtainWall(style, cxl, cy, cxr) {
      var hei = style.curtainWallHeight;
      addBuilding(style, cxl+2, cy - 1, cxr - cxl-2, hei, 3);
      // Gates
      var middleLeft = Math.floor(0.5 * (cxl + cxr));
      addTile(middleLeft, cy - 1, style.gateL);
      addTile(middleLeft + 1, cy - 1, style.gateR);
    }

    function OLDverticalWall(style, cx, cyb, cyt) {
      var hei = style.curtainWallHeight;
      addBuilding(style, cx-1, cyb + 1, 3, hei, cyt - cyb - 2);
    }
    function verticalCurtainWall(style, cx, cyb, cyt) {
      var y = cyb + style.curtainWallHeight;
      var wid = 3;
      var platform = cyt - cyb - 2;
      fillRect(cx - 1, y, wid, platform - 1, style.platformTile);
      // BlueCrenelation
      //addRect(cx - 1, y, wid, platform, sMaterials.BLUECRENELATION);
      // Left crenelation
      var crenelationMaterial = style.crenelationMaterial;
      fillRect(cx - 1, y, 1, platform - 1, crenelationMaterial.ml);
      addTile(cx - 1, y + platform - 1, crenelationMaterial.tl_cut);
      fillRect(cx + 1, y, 1, platform - 1, crenelationMaterial.mr);
      addTile(cx + 1, y + platform - 1, crenelationMaterial.tr_cut);
      addTile(cx, y + platform - 1, style.door);
    }

    function makeCastle(style) {
      // Ground
      fillRect(5, 4, 20, 15, style.groundTile) // Dirt
    
      // Back wall
      horizontalCurtainWall(style, 5, 18, 24);
      // Back towers
      thinTower(style, 5, 18);
      thinTower(style, 24, 18);
    
      verticalCurtainWall(style, 5, 4, 18);
      verticalCurtainWall(style, 24, 4, 18);

      gatedHorizontalCurtainWall(style, 5, 4, 24);
      thinTower(style, 5, 4, 10);
      thinTower(style, 24, 4, 10);
    
      // Big-ass dungeon
      addBuilding(style, 10, 13, 10, 8, 7);
      addBuilding(style, 13, 22, 4, 4, 4);
    }

    var aStyle = {
      wallMaterial: sMaterials.BLUEWALLS,
      crenelationMaterial: sMaterials.BLUECRENELATION,
      platformTile: 9,
      groundTile: 106, // dirt
      gateL: 632,
      gateR: 633,
      door: 33,
      window: 845,
      trapdoor: 1829,
      towerHeight: 10,
      curtainWallHeight: 5,
      
    };
    
    makeCastle(aStyle);
    

    /*
    addRect(9, 6, 12, 6, sMaterials.BLUEWALLS);
    addRect(9, 11, 12, 3, sMaterials.BLUECRENELATION);
    addRect(5, 5, 5, 10, sMaterials.BLUEWALLS);
    addRect(5, 13, 5, 5, sMaterials.BLUECRENELATION);
    addRect(20, 5, 5, 10, sMaterials.BLUEWALLS);
    addRect(20, 13, 5, 5, sMaterials.BLUECRENELATION);
    */

    $scope.getCastleTile = function(x, y) {
      return 5;
    }
    $scope.getStyle = sUtils.getStyle;
  });
