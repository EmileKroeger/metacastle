'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sGarden
 * @description
 * # sGarden
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
  .service('sShapes', function sShapes(sUtils) {
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
    ShapeGrid.prototype.get = function(x, y) {
      return this.map[x][y];
    }




    var STATUS_UNDECIDED = 0;
    var STATUS_GROUND = 1;
    var STATUS_WALL = 2;
    
    function MazeBuilder(wid, hei) {
      console.log("wid: " + wid + " hei: " + hei); 
      this.wid = wid;
      this.hei = hei;
      this.grid = new ShapeGrid(wid, hei);
      this.border = []
    }
    MazeBuilder.prototype.checkBorder = function(i, j) {
      if (this.grid.get(i, j) == STATUS_UNDECIDED) {
        this.border.push({i: i, j: j});
      }
    }
    MazeBuilder.prototype.isValidGround = function(i, j) {
      var count = 0;
      if (this.grid.get(i+1, j) == STATUS_GROUND) { count += 1; }
      if (this.grid.get(i-1, j) == STATUS_GROUND) { count += 1; }
      if (this.grid.get(i, j+1) == STATUS_GROUND) { count += 1; }
      if (this.grid.get(i, j-1) == STATUS_GROUND) { count += 1; }
      return count <= 1;
    }
    MazeBuilder.prototype.addGround = function(i, j) {
      this.grid.set(i, j, STATUS_GROUND);
      this.checkBorder(i-1, j);
      this.checkBorder(i+1, j);
      this.checkBorder(i, j-1);
      this.checkBorder(i, j+1);
    }
    
    MazeBuilder.prototype.fill = function(i0, j0) {
      for (var i = 0; i < this.wid; i++) {
        for (var j = 0; j < this.hei; j++) {
          if ((i == 0) || (i == this.wid - 1) || (j == 0) || (j == this.hei - 1) ) {
            this.grid.set(i, j, STATUS_WALL);
          } else {
            this.grid.set(i, j, STATUS_UNDECIDED);
          }
        }
      }
      this.addGround(i0, j0);
      while (this.border.length > 0) {
        var point = sUtils.popChoice(this.border);
        if (this.isValidGround(point.i, point.j)) {
          this.addGround(point.i, point.j)
        } else {
          this.grid.set(point.i, point.j, STATUS_WALL);
        }
      }
      //this.grid.set(x0, y0, STATUS_UNDECIDED);
    }
    MazeBuilder.prototype.forTiles = function(callback) {
      for (var i = 0; i < this.wid; i++) {
        for (var j = 0; j < this.wid; j++) {
          callback(i, j, this.grid.get(i, j) == STATUS_WALL);
        }
      }
    }



    function Shape(grid, defaultTile) {
      this.grid = grid;
      this.defaultTile = defaultTile;
    }



    Shape.prototype.set = function(x, y, tileDef) {
      if (Array.isArray(tileDef)) {
        this.grid.set(x, y, tileDef[(x + y) % 2]);
      } else {
        this.grid.set(x, y, tileDef);
      }
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
          this.set(x, y, tiles[i]);
        }
      }
    }

    Shape.prototype.addRect = function(x0, y0, wid, hei, tile) {
      for (var x=x0; x<(x0+wid); x++) {
        for (var y=y0; y<(y0+hei); y++) {
          this.set(x, y, tile);
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
        // Go through layers backwards
        for (var i = 0; i < layers.length; i++) {
          var radius = layers.length - i;
          this.addCross(cx, cy, 2, radius, layers[i]);
        }
      } else if (featureDef.type == "rectangle") {
        var layers = featureDef.layers;
        // Go through layers backwards
        for (var i = 0; i < layers.length; i++) {
          var radius = layers.length - i;
          var lenX = radius + featureDef.extra_x;
          var lenY = radius + featureDef.extra_y;
          this.addRect(cx - lenX, cy  - lenY, 2 * lenX + 1, 2 * lenY + 1, layers[i]);
        }
      } else if (featureDef.type == "vertical") {
        var layers = featureDef.layers;
        // Go through layers backwards
        for (var i = 0; i < layers.length; i++) {
          var radius = layers.length - i;
          var lenX = radius + featureDef.extra_x;
          var lenY = featureDef.half_y;
          if (i > 0) {
            lenY -= 1; // Special: the outermost layer always goes all the way around
          }
          this.addRect(cx - lenX, cy  - lenY, 2 * lenX + 1, 2 * lenY + 1, layers[i]);
        }
      } else if (featureDef.type == "maze") {
        var halfWid = featureDef.halfWid;
        var halfHei = featureDef.halfHei;
        var bg = featureDef.bg;
        var fg = featureDef.fg;
        // Prim's algorithm
        var STATUS_WALL = 1;
        var STATUS_GROUND = 2;
        var STATUS_EDGE = 3;
        var wid = 2 * halfWid - 1;
        var hei = 2 * halfHei - 1;
        var x0 = cx - halfWid + 1
        var y0 = cy - halfHei + 1
        this.addRect(x0 - 1, y0 - 1, wid + 2, hei + 2, bg);
        var mazeBuilder = new MazeBuilder(wid, hei);
        mazeBuilder.fill(2, 0);
        var self = this;
        mazeBuilder.forTiles(function(i, j, isWall) {
          var x = x0 + i;
          var y = y0 + j;
          if (isWall) {
            self.set(x, y, fg);
          } else {
            self.set(x, y, bg);
          }
        })
        
      } else if (featureDef.type == "blobs") {
      }
    }
    

    // Define these as service globals
    this.ShapeGrid = ShapeGrid;
    this.Shape = Shape;
    //this.MazeBuilder = MazeBuilder;
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
          // Now, add decorations
          if (recipe.decorations != undefined) {
            for (var x = 0; x < scene.wid; x++) {
              for (var y = 0; y < scene.wid; y++) {
                var tileType = grid.map[x][y];
                var decoration = recipe.decorations[tileType];
                if (decoration != undefined) {
                  decoration.render(x, y);
                }
              }
            }
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
        var TREE = 500
        var BUSH = 600
        var WILDGRASS = 700

        this.rendererGarden = function(scene) {
          var CIRCULAR_POND_WITH_ISLAND = {
            type: "circle",
            layers: [
              GROUND,
              WATER,
              WATER,
              oneOf([DECORATION_C, WILDGRASS]),
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
              oneOf([DECORATION_C, WILDGRASS]),
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
          var PLACE_WITH_TREES = {
            type: "rectangle",
            extra_x: oneOf([3, 4]),
            extra_y: oneOf([2, 3]),
            layers: [
              GROUND,
              [GROUND, TREE],
              GROUND,
              WILDGRASS,
            ]
          };
          var VERTICAL_HALL = {
            type: "vertical",
            extra_x: oneOf([1, 2]),
            half_y: oneOf([5, 6, 7]),
            layers: [
              GROUND,
              [GROUND, TREE],
              GROUND,
              oneOf([GROUND, GROUND, WATER, DECORATION_C]),
            ]
          };
          var DOUBLE_VERTICAL_HALL = {
            type: "vertical",
            extra_x: oneOf([1, 2]),
            half_y: oneOf([5, 6, 7]),
            layers: [
              GROUND,
              [GROUND, TREE],
              GROUND,
              [GROUND, oneOf([TREE, BUSH])],
              GROUND,
            ]
          };
          var RECT_MAZE = {
            type: "maze",
            halfWid: 8,
            halfHei: 6,
            bg: GROUND,
            fg: BUSH,
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
              [DECORATION_C]: sMaterials.REDWHITEFLOWERS,
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
                  /*
                  PLACE_WITH_TREES,
                  VERTICAL_HALL,
                  DOUBLE_VERTICAL_HALL,
                  HORIZONTAL_POND_WITH_ISLAND,
                  CIRCULAR_POND_WITH_ISLAND,
                  MEDIUM_POND,
                  */
                  RECT_MAZE,
                ]),
              }
            ],
            materials: oneOf([
              GARDENMATERIALS_BLUE,
              GARDENMATERIALS_RED,
              GARDENMATERIALS_RED2,
              //GARDENMATERIALS_GRASSES,
            ]),
            decorations: {
              //[HALFTREES]: sDecorations.random_bush,
              [TREE]: oneOf([
                sDecorations.tall_tree,
                sDecorations.tall_pine,
                sDecorations.short_fruit_tree,
                sDecorations.tall_fruit_tree,
              ]),
              //[BUSH]: sDecorations.random_bush,
              [BUSH]: sDecorations.short_fruit_tree,
              [WILDGRASS]: sDecorations.random_grass,
            }
          };
          var recipe = interpretMetaRecipe(CROSS_DEF);
          render(recipe, scene);
        };
        this.garden = this.rendererGarden;
      });
      
