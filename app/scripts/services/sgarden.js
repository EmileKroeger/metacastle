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
    }
    Shape.prototype.addFeature = function(featureDef) {
      var cx = featureDef.cx;
      var cy = featureDef.cy;
      if (featureDef.type == "circle") {
        var layers = featureDef.layers;
        // Go through them backwards
        for (var i = 0; i < layers.length; i++) {
          var radius = layers.length - i;
          this.addCross(cx, cy, 2, radius, layers[i]);
        }
      } else if (featureDef.type == "rectangle") {
        var layers = featureDef.layers;
        // Go through them backwards
        for (var i = 0; i < layers.length; i++) {
          var radius = layers.length - i;
          var lenX = radius + featureDef.extra_x;
          var lenY = radius + featureDef.extra_y;
          this.addRect(cx - lenX, cy  - lenY, 2 * lenX + 1, 2 * lenY + 1, layers[i]);
        }
        
      }
    }

    // Define these as service globals
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
        //this.garden = this.shapeGarden;
        
        function createGrid(definition) {
          var grid = new sShapes.ShapeGrid(definition.wid, definition.hei);
          var shape = new sShapes.Shape(grid, 0);
          // 1) Carve the background
          if (definition.background) {
            var bg = definition.background;
            if (bg.type == "quartered") {
              shape.quarterField(definition.wid, definition.wid,
                bg.cx, bg.cy, [0, bg.type_a, bg.type_b]);
            }
          }
          // Add features
          if (definition.features) {
            for (var i = 0; i < definition.features.length; i++) {
              shape.addFeature(definition.features[i]);
            }
          }
          return grid;
        }
        
        function render(recipe, scene) {
          // First, create a grid
          var grid = createGrid(recipe);
          // Rendering: 1) Fill in scene parameters
          scene.wid = recipe.wid;
          scene.hei = recipe.hei;
          // And 2) Fill in other stuff
          for (var tileType in recipe.materials) {
            recipe.materials[tileType].fillRegion(grid.map, tileType);
          }
        }
        
        function interpretMetaRecipe(metaRecipe) {
          // Recursive deep copy with interpretation
          if (Array.isArray(metaRecipe)) {
            var result = [];
            for (var i=0; i < metaRecipe.length; i++) {
              result.push(interpretMetaRecipe(metaRecipe[i]));
            }
            return result;
            
          } else if (typeof(metaRecipe) === "object") {
            var recipe = {};
            for (var key in metaRecipe) {
              var value = interpretMetaRecipe(metaRecipe[key]);
              if (key === "!MERGE") {
                // Special: don't assign to value; instead, read many
                for (var subkey in value) {
                  recipe[subkey] = value[subkey];
                }
                
              } else {
                recipe[key] = value;
              }
            }
            return recipe;
          } else {
            return angular.copy(metaRecipe);
          }
        }
        
        function oneOf(choices) {
          // Simple version: random choice
          return sUtils.choice(choices);
          // (a more advanced version could be rerunnable)
        }
        
        // UTILITY CONSTANTS
        var GROUND = 0
        var WATER = 100
        var DECORATION_A = 200
        var DECORATION_B = 300
        var DECORATION_C = 400

        this.rendererGarden = function(scene) {
          var CIRCULAR_POND_WITH_ISLAND = {
            type: "circle",
            layers: [
              GROUND,
              WATER,
              WATER,
              DECORATION_C,
            ]
          };
          var HORIZONTAL_POND_WITH_ISLAND = {
            type: "rectangle",
            extra_x: oneOf([1, 2]),
            extra_y: oneOf([0, 1]),
            layers: [
              GROUND,
              WATER,
              WATER,
              DECORATION_C,
            ]
          };
          var MEDIUM_POND = {
            type: "rectangle",
            extra_x: oneOf([3, 4]),
            extra_y: oneOf([2, 3]),
            layers: [
              GROUND,
              WATER,
            ]
          };
          var GARDENMATERIALS_BLUE = {
              [WATER]: sMaterials.WATER_STONE,
              [DECORATION_A]: sMaterials.WHITEFLOWERS,
              [DECORATION_B]: sMaterials.BLUEFLOWERS,
              [DECORATION_C]: sMaterials.BLUEWHITEFLOWERS,
          };
          var GARDENMATERIALS_RED = {
              [WATER]: sMaterials.WATER_STONE,
              [DECORATION_A]: sMaterials.WHITEFLOWERS,
              [DECORATION_B]: sMaterials.REDFLOWERS,
              [DECORATION_C]: sMaterials.REDGRASS,
          };
          var GARDENMATERIALS_RED2 = {
              [WATER]: sMaterials.WATER_STONE,
              [DECORATION_A]: sMaterials.WHITEFLOWERS,
              [DECORATION_B]: sMaterials.WHITEFLOWERS,
              [DECORATION_C]: sMaterials.REDFLOWERS,
          };
          var GARDENMATERIALS_GRASSES = {
              [WATER]: sMaterials.WATER_STONE,
              [DECORATION_A]: sMaterials.REDGRASS,
              [DECORATION_B]: sMaterials.PURPLEGRASS,
              [DECORATION_C]: sMaterials.WHITEFLOWERS,
          };
          // Meta cross def
          var CROSS_DEF = {
            wid: 30,
            hei: 30,
            background: {
              type: "quartered",
              cx: 14,
              cy: 15,
              type_a: DECORATION_A,
              type_b: DECORATION_B,
            },
            features: [
              {
                cx: 14,
                cy: 15,
                "!MERGE": oneOf([
                  HORIZONTAL_POND_WITH_ISLAND,
                  CIRCULAR_POND_WITH_ISLAND,
                  MEDIUM_POND,
                ]),
              }
            ],
            materials: oneOf([
              GARDENMATERIALS_BLUE,
              GARDENMATERIALS_RED,
              GARDENMATERIALS_RED2,
              GARDENMATERIALS_GRASSES,
            ]),
          };
          var recipe = interpretMetaRecipe(CROSS_DEF);
          render(recipe, scene);
        };
        this.garden = this.rendererGarden;
      });
      
