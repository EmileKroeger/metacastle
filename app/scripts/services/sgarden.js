'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sGarden
 * @description
 * # sGarden
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
  .service('sShapes', function sShapes() {
    /*
    // What I want my garden code to look like
    canvas = BaseCanvas(30, 30);
    baseRect = canvas.base
    baseRect.quarter(cx, cy);
    baseRect.topleft // Is a shape
    baseRect.topleft.quarter()
    baseRect.children
    */
    // So basically I have shapes, that have children, that may have handy names
    //quarter = Quartering(baseRect);
    //makeHorizontal(quarter.topleft);
    //makeHorizontal(quarter.bottomright);
    function ShapeGrid(wid, hei) {
      this.map = [];
      for (var x=0; x<wid; x++) {
        var column = [];
        column.length = hei;
        column.fill(0);
        this.map.push(column);
      }
    }
    ShapeGrid.prototype.set = function(x, y, value) {
      this.map[x][y] = value;
    }
    function Shape(grid, defaultTile) {
      this.grid = grid;
      this.defaultTile = defaultTile;
    }
    Shape.prototype.quarterField = function(wid, hei, cx, cy, tiles) {
      for (var x=0; x < wid; x++) {
        for (var y=0; y < hei; y++) {
          var d = (x - cx) * (y - cy);
          var i = 0;
          if (d == 0) {
            // path
            i = 0;
          } else if (d > 0) {
            // Terrain a
            i = 1;
          } else {
            // Terrain B
            i = 2;
          }
          this.grid.set(x, y, tiles[i]);
        }
      }
    }
    
    Shape.prototype.addRect = function(x0, y0, wid, hei, tile) {
      for (var x=x0; x<(x0+wid); x++) {
        for (var y=y0; y<(y0+hei); y++) {
          this.grid.set(x, y, tile);
        }
      }
    }
    
    Shape.prototype.addCross = function(cx, cy, longhalf, shorthalf, tile) {
      var edge = longhalf + shorthalf;
      var rectlong = 2 * edge + 1;
      var rectshort = 2 * shorthalf + 1;
      this.addRect(cx-edge, cy-shorthalf, rectlong, rectshort, tile);
      this.addRect(cx-shorthalf, cy-edge, rectshort, rectlong, tile);
      //addRect(cx-edge, cy-shorthalf, 2 * edge + 1, 2 * shorthalf + 1, tile);
    }
    this.ShapeGrid = ShapeGrid;
    this.Shape = Shape;
  })
  .service('sGarden', function sGarden(sStyles, sBuildings, sUtils,
      sDecorators, sDecorations, sMaterials, sDisplay, sShapes) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        var FLOWERS_STYLE = {
          flowers: [
            sMaterials.BLUEFLOWERS,
            sMaterials.REDFLOWERS,
            sMaterials.WHITEFLOWERS,
          ],
        }

        this.shapeGarden = function(scene) {
          scene.wid = 30;
          scene.hei = 30;
          var grid = new sShapes.ShapeGrid(scene.wid, scene.hei);
          var shape = new sShapes.Shape(grid, 0);
          /*
          */
          var cx = 14;
          var cy = 15;
          shape.quarterField(scene.wid, scene.hei, cx, cy, [0, 1, 2]);
          shape.addCross(cx, cy, 2, 4, 0)
          shape.addCross(cx, cy, 2, 3, 109)
          shape.addCross(cx, cy, 2, 1, 1903)
          sMaterials.BLUEWHITEFLOWERS.fillRegion(grid.map, 1903);
          sMaterials.WATER_STONE.fillRegion(grid.map, 109);
          //sMaterials.GRASS.fillRegion(grid.map, 0);
          sMaterials.REDFLOWERS.fillRegion(grid.map, 1);
          sMaterials.WHITEFLOWERS.fillRegion(grid.map, 2);
        }
        this.garden = this.shapeGarden;

      });
      
