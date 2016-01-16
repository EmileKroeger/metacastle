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
  .controller('MainCtrl', function ($scope, sUtils, sMaterials, sDisplay) {
    $scope.range = sUtils.range;
    $scope.getTilemapTile = function(x, y) {
      // Return the tile code from the same place
      return 100 * (30 - y) + x;
    }
    $scope.CASTLEWID = 30;
    $scope.CASTLEHEI = 30;
    
    $scope.tiles = sDisplay.tiles;
    
    function addBuilding(style, x, y, wid, hei, platform) {
      // Wall
      sDisplay.addRect(x, y, wid, hei - 1, style.wallMaterial);
      // Platform tiles
      sDisplay.fillRect(x, y + hei - 1, wid, platform - 1, style.platformTile);
      // Crenelation
      sDisplay.addRect(x, y + hei - 1, wid, platform, style.crenelationMaterial);
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
      sDisplay.addTile(middleLeft, cy - 1, style.gateL);
      sDisplay.addTile(middleLeft + 1, cy - 1, style.gateR);
    }

    function OLDverticalWall(style, cx, cyb, cyt) {
      var hei = style.curtainWallHeight;
      addBuilding(style, cx-1, cyb + 1, 3, hei, cyt - cyb - 2);
    }
    function verticalCurtainWall(style, cx, cyb, cyt) {
      var y = cyb + style.curtainWallHeight;
      var wid = 3;
      var platform = cyt - cyb - 2;
      sDisplay.fillRect(cx - 1, y, wid, platform - 1, style.platformTile);
      // BlueCrenelation
      //addRect(cx - 1, y, wid, platform, sMaterials.BLUECRENELATION);
      // Left crenelation
      // TODO: make a primitive to do this
      var crenelationMaterial = style.crenelationMaterial;
      sDisplay.fillRect(cx - 1, y, 1, platform - 1, crenelationMaterial.ml);
      sDisplay.addTile(cx - 1, y + platform - 1, crenelationMaterial.tl_cut);
      sDisplay.fillRect(cx + 1, y, 1, platform - 1, crenelationMaterial.mr);
      sDisplay.addTile(cx + 1, y + platform - 1, crenelationMaterial.tr_cut);
      sDisplay.addTile(cx, y + platform - 1, style.door);
    }

    // Buildings
    function thinTower(style, cx, cy) {
      var hei = style.towerHeight;
      addBuilding(style, cx - 2, cy - 2, 5, hei, 4);
      sDisplay.addTile(cx, cy + hei - 2, style.trapdoor)
      sDisplay.addTile(cx - 1, cy + hei - 5, style.window)
      sDisplay.addTile(cx + 1, cy + hei - 5, style.window)
    }

    function tinyTower(style, cx, cy) {
      var hei = style.towerHeight;
      addBuilding(style, cx - 1, cy - 1, 3, hei, 3);
      sDisplay.addTile(cx, cy + hei - 4, style.window)
    }


    function buildingWithHat(style, x, y, wid) {
      addBuilding(style, x, y, wid, 8, 7);
      addBuilding(style, x + 3, y + 9, wid - 6, 4, 4);
      var middleLeft = x + Math.floor(wid / 2.0) - 1; // why?
      sDisplay.addTile(middleLeft, y, style.gateL);
      sDisplay.addTile(middleLeft + 1, y, style.gateR);
    }
    
    function towerCornerBuilding(style, x, y, wid) {
      addBuilding(style, x, y, wid, 8, 7);
      tinyTower(style, x, y);
      tinyTower(style, x + wid - 1, y);
      // TODO: find a way of factoring this
      var middleLeft = x + Math.floor(wid / 2.0) - 1; // why?
      sDisplay.addTile(middleLeft, y, style.gateL);
      sDisplay.addTile(middleLeft + 1, y, style.gateR);
    }

    function makeCastle(style, curtainPath) {
      // Ground
      sDisplay.fillRect(5, 4, 20, 15, style.groundTile) // Dirt

      // Create list of stuff to render:
      //  1) wall
      var renderers = makeCurtainWall(style, curtainPath)

      // 2) Entrance building
      var entranceRenderer = new BuildingRenderer(addBuilding, 12, 2, [6, 6, 5]);
      renderers.push(entranceRenderer)
      // 3) Big-ass dungeon
      renderers.push(new BuildingRenderer(style.dungeonFunc, 10, 13, [10]));

      // Now render everything
      renderBuildings(style, renderers);
    }
    
    function makeCurtainSegmentRenderer(posA, posB) {
      var xA = posA[0];
      var yA = posA[1];
      var xB = posB[0];
      var yB = posB[1];
      if (xA == xB) {
        // Same X, it's vertical
        // Actually we want the smallest
        var y = Math.min(yA, yB);
        var y2 = Math.max(yA, yB);
        return new BuildingRenderer(verticalCurtainWall, xA, y, [y2]);
      } else if (yA == yB) {
        // Same Y, it's horizontal
        var x = Math.min(xA, xB);
        var x2 = Math.max(xA, xB);
        return new BuildingRenderer(horizontalCurtainWall, x, yA, [x2]);
      }
    }
    
    // Object-oriented renderer.
    function BuildingRenderer(func, x, y, args) {
      this.func = func;
      this.x = x;
      this.y = y;
      this.args = args;
    }
    BuildingRenderer.prototype.render = function(style) {
      var call_args = [style, this.x, this.y];
      call_args.push.apply(call_args, this.args);
      this.func.apply(this, call_args);
    }

    function TowerRenderer(func, cx, cy) {
      this.x = cx - 2;
      this.y = cy - 2;
      this.render = function(style) {
        func(style, cx, cy);
      }
    }

    function renderBuildings(style, buildings) {
      buildings.sort(function(bA, bB) {return bA.y < bB.y;});
      buildings.forEach(function(building) {
        building.render(style);
      });
    }
    function makeCurtainWall(style, path) {
      var renderers = [];
      var prev = path[path.length - 1];
      path.forEach(function(towerPos) {
        renderers.push(makeCurtainSegmentRenderer(prev, towerPos));
        var tower = new TowerRenderer(style.towerFunc, towerPos[0],
          towerPos[1], []);
        renderers.push(tower);
        prev = towerPos;
      });
      return renderers;
    }
    
    var wallPath = [
      [5, 18],
      [24, 18],
      [24, 4],
      [5, 4],
    ];

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
      towerFunc: thinTower,
      //towerFunc: tinyTower,
      //dungeonFunc: buildingWithHat,
      dungeonFunc: towerCornerBuilding,
    };
    
    makeCastle(aStyle, wallPath);

    $scope.getCastleTile = function(x, y) {
      return 5;
    }
    $scope.getStyle = sUtils.getStyle;
  });
