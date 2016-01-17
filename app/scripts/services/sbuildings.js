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
    this.addBuilding = function(style, x, y, wid, hei, platform, decorators) {
      // Wall
      var facade = {
        x: x,
        y: y,
        wid: wid,
        hei: hei - 1,
      }
      style.wallMaterial.fillRect(facade)
      // Platform tiles
      var platformsurface = {
        x: x,
        y: y + hei - 1,
        wid: wid,
        hei: platform,
      }
      
      sDisplay.fillRect(x, y + hei - 1, wid, platform - 1, style.platformTile);
      // Crenelation
      style.crenelationMaterial.fillRect(platformsurface)
      // Decorators
      if (decorators && decorators.facade) {
        decorators.facade.render(style, facade);
      }
      if (decorators && decorators.platform) {
        var topsurface = {
          x: x + 1,
          y: y + hei,
          wid: wid - 2,
          hei: platform - 1,
        }
        decorators.platform.render(style, topsurface);
      }
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
      style.gate.render(middleLeft, cy - 1);
    }

    this.verticalCurtainWall = function(style, cx, cyb, cyt) {
      var y = cyb + style.curtainWallHeight;
      var wid = 3;
      var platform = cyt - cyb - 2;
      sDisplay.fillRect(cx - 1, y, wid, platform - 1, style.platformTile);
      // TODO: make a primitive to do this
      var crenelationMaterial = style.crenelationMaterial;
      sDisplay.fillRect(cx - 1, y, 1, platform - 1, crenelationMaterial.ml);
      sDisplay.addTile(cx - 1, y + platform - 1, crenelationMaterial.tl_cut);
      sDisplay.fillRect(cx + 1, y, 1, platform - 1, crenelationMaterial.mr);
      sDisplay.addTile(cx + 1, y + platform - 1, crenelationMaterial.tr_cut);
      style.door.render(cx, y + platform - 1);
    }

    // Buildings
    this.thinTower = function(style, cx, cy) {
      var hei = style.towerHeight;
      sBuildings.addBuilding(style, cx - 2, cy - 2, 5, hei, 4, 
        style.towerDecorators);
    }

    this.tinyTower = function(style, cx, cy) {
      var hei = style.towerHeight;
      sBuildings.addBuilding(style, cx - 1, cy - 1, 3, hei, 3, 
        style.towerDecorators);
      //sDisplay.addTile(cx, cy + hei - 4, style.window)
    }


    this.buildingWithHat = function(style, x, y, wid) {
      sBuildings.addBuilding(style, x, y, wid, 8, 7);
      sBuildings.addBuilding(style, x + 3, y + 9, wid - 6, 4, 4);
      var middleLeft = x + Math.floor(wid / 2.0) - 1; // why?
      style.gate.render(middleLeft, y);
    }
    
    this.towerCornerBuilding = function(style, x, y, wid) {
      sBuildings.addBuilding(style, x, y, wid, 8, 7,
        style.dungeonDecorators);
      sBuildings.tinyTower(style, x, y);
      sBuildings.tinyTower(style, x + wid - 1, y);
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
    function BuildingRenderer(func, x, y, args, style) {
      this.func = func;
      this.x = x;
      this.y = y;
      this.args = args;
      this.style = style; // optional extra style
    }
    BuildingRenderer.prototype.render = function(style) {
      if (this.style) {
        style = this.style;
      }
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
    
    function makeNodeRenderer(style, nodeType, x, y) {
      if (nodeType == "tower") {
        return new TowerRenderer(style.towerFunc, x, y, []);
      } else if (nodeType == "dungeon") {
        return new BuildingRenderer(style.dungeonFunc, x-4, y-5, [10],
          style);
      } else if (nodeType == "entrance") {
        return new BuildingRenderer(sBuildings.addBuilding, x-2, y-2,
          [6, 6, 5, style.entranceDecorators]);
      }
      return new TowerRenderer(style.towerFunc, x, y, []);
    }

    function makeCurtainWall(style, path) {
      var renderers = [];
      var prev = path[path.length - 1];
      path.forEach(function(node) {
        renderers.push(makeCurtainSegmentRenderer(prev, node));
        var nodeStyle = style;
        // Optional fourth parameter is custom style:
        if (node.length > 3) {
          nodeStyle = node[3];
        }
        renderers.push(makeNodeRenderer(nodeStyle, node[2], node[0],
          node[1]));
        prev = node;
      });
      return renderers;
    }

    function renderBuildings(style, buildings) {
      buildings.sort(function(bA, bB) {return bA.y < bB.y;});
      buildings.forEach(function(building) {
        building.render(style);
      });
    }


    this.fillPath = function(path, tilecode) {
      // Helper for tracking who's been filled
      var filled = {};
      function fill(poscode) {
        if (filled[poscode]) {
          return false;
        } else {
          filled[poscode] = true;
          var x = poscode % 100;
          var y = Math.floor((poscode - x) / 100);

          sDisplay.addTile(x, y, tilecode);
          return true;
        }
      }
      // Helper for getting lines
      function forBetween(a, b, callback) {
        if (a > b) {
          var tmp = b;
          b = a;
          a = tmp;
        }
        for (var n = a; n <= b; n++) {
          callback(n);
        }
      }
      // First, fill in all the borders
      //   nb: this could be a good place to use
      //   special border tiles...
      var prev = path[path.length - 1];
      path.forEach(function(point) {
        var px = prev[0];
        var py = prev[1];
        var cx = point[0];
        var cy = point[1];
        if (px == cx) {
          forBetween(py, cy, function(y) {
            fill(cx + 100 * y);
          });
        } else {
          // py == cy can be assumed
          forBetween(px, cx, function(x) {
            fill(x + 100 * py);
          });
        }
        prev = point;
      });
      // Now, flood-fill the rest
      // Lazily assume the first point is top-left
      var firstpoint = path[0][0] + 1 + 100 * (path[0][1] - 1);
      var border = [firstpoint];
      while (border.length > 0) {
        var point = border.pop();
        if (fill(point)) {
          // Add all neighbours to border
          border.push(point - 1);
          border.push(point + 1);
          border.push(point - 100);
          border.push(point + 100);
        }
        // else, already filled, do nothing
      }
    }

    this.makeCastle = function(style, curtainPath) {
      // Cover Ground
      this.fillPath(curtainPath, style.groundTile);

      // Get things to render
      var renderers = makeCurtainWall(style, curtainPath);

      // Now render everything
      renderBuildings(style, renderers);
    }
  });
