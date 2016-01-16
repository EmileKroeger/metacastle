'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sBuildings
 * @description
 * # sBuildings
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
  .service('sBuildings', function(sDisplay) {
    var sBuildings = this;
    this.addBuilding = function(style, x, y, wid, hei, platform) {
      // Wall
      sDisplay.addRect(x, y, wid, hei - 1, style.wallMaterial);
      // Platform tiles
      sDisplay.fillRect(x, y + hei - 1, wid, platform - 1, style.platformTile);
      // Crenelation
      sDisplay.addRect(x, y + hei - 1, wid, platform, style.crenelationMaterial);
    }
    
    this.horizontalCurtainWall = function(style, cxl, cy, cxr) {
      var hei = style.curtainWallHeight;
      sBuildings.addBuilding(style, cxl+2, cy - 1, cxr - cxl-2, hei, 3);
    }
    this.gatedHorizontalCurtainWall = function(style, cxl, cy, cxr) {
      var hei = style.curtainWallHeight;
      sBuildings.addBuilding(style, cxl+2, cy - 1, cxr - cxl-2, hei, 3);
      // Gates
      var middleLeft = Math.floor(0.5 * (cxl + cxr));
      sDisplay.addTile(middleLeft, cy - 1, style.gateL);
      sDisplay.addTile(middleLeft + 1, cy - 1, style.gateR);
    }

    this.verticalCurtainWall = function(style, cx, cyb, cyt) {
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
    this.thinTower = function(style, cx, cy) {
      var hei = style.towerHeight;
      sBuildings.addBuilding(style, cx - 2, cy - 2, 5, hei, 4);
      sDisplay.addTile(cx, cy + hei - 2, style.trapdoor)
      sDisplay.addTile(cx - 1, cy + hei - 5, style.window)
      sDisplay.addTile(cx + 1, cy + hei - 5, style.window)
    }

    this.tinyTower = function(style, cx, cy) {
      var hei = style.towerHeight;
      sBuildings.addBuilding(style, cx - 1, cy - 1, 3, hei, 3);
      sDisplay.addTile(cx, cy + hei - 4, style.window)
    }


    this.buildingWithHat = function(style, x, y, wid) {
      sBuildings.addBuilding(style, x, y, wid, 8, 7);
      sBuildings.addBuilding(style, x + 3, y + 9, wid - 6, 4, 4);
      var middleLeft = x + Math.floor(wid / 2.0) - 1; // why?
      sDisplay.addTile(middleLeft, y, style.gateL);
      sDisplay.addTile(middleLeft + 1, y, style.gateR);
    }
    
    this.towerCornerBuilding = function(style, x, y, wid) {
      sBuildings.addBuilding(style, x, y, wid, 8, 7);
      sBuildings.tinyTower(style, x, y);
      sBuildings.tinyTower(style, x + wid - 1, y);
      // TODO: find a way of factoring this
      var middleLeft = x + Math.floor(wid / 2.0) - 1; // why?
      sDisplay.addTile(middleLeft, y, style.gateL);
      sDisplay.addTile(middleLeft + 1, y, style.gateR);
      // TODO: add top towers, more complicated
    }
  })
  .service('sBuildingRenderers', function(sBuildings, sDisplay) {

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
        return new BuildingRenderer(sBuildings.verticalCurtainWall, xA, y, [y2]);
      } else if (yA == yB) {
        // Same Y, it's horizontal
        var x = Math.min(xA, xB);
        var x2 = Math.max(xA, xB);
        return new BuildingRenderer(sBuildings.horizontalCurtainWall, x, yA, [x2]);
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

    this.makeCastle = function(style, curtainPath) {
      // Ground
      sDisplay.fillRect(5, 4, 20, 15, style.groundTile) // Dirt

      // Create list of stuff to render:
      //  1) wall
      var renderers = makeCurtainWall(style, curtainPath)

      // 2) Entrance building
      var entranceRenderer = new BuildingRenderer(sBuildings.addBuilding, 12, 2, [6, 6, 5]);
      renderers.push(entranceRenderer)
      // 3) Big-ass dungeon
      renderers.push(new BuildingRenderer(style.dungeonFunc, 10, 13, [10]));

      // Now render everything
      renderBuildings(style, renderers);
    }

  });