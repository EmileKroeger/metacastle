'use strict';
angular.module('metacastleApp')
  .controller('MainCtrl', function ($scope, sUtils, sDisplay,
      sBuildings, sBuildingRenderers, sStyles, sMaterials) {
    $scope.range = sUtils.range;
    $scope.getTilemapTile = function(x, y) {
      // Return the tile code from the same place
      return 100 * (30 - y) + x;
    }
    $scope.tiles = sDisplay.tiles;

    $scope.CASTLEWID = 30;
    $scope.CASTLEHEI = 30;
    $scope.showTilemap = true;

    var scene = new sBuildingRenderers.Scene();

    var castle_id = 0;
    // 0: small with palette
    // 1: big weird shape
    // 2: souble wall
    // 3: experiments with fill
    if (castle_id == 0) {
      var wallPath = [
        [5,  18, sBuildings.ThinTower],
        [14, 18, sBuildings.TowerCornerBuilding],
        [24, 18, sBuildings.ThinTower],
        [24, 4,  sBuildings.ThinTower],
        [14, 4,  sBuildings.Entrance],
        [5,  4,  sBuildings.ThinTower],
      ];
      scene.addWall(wallPath, sStyles.templarWallStyle);
    } if(castle_id == 1) {
      // Big awkwardly-shaped castle
      $scope.showTilemap = false;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 45;
      wallPath = [
        [5,  33, sBuildings.ThinTower],
        [30, 33, sBuildings.TowerCornerBuilding, sStyles.templarDungeonStyle],
        [62, 33, sBuildings.ThinTower],
        [62, 19, sBuildings.ThinTower],
        [43, 19, sBuildings.ThinTower],
        [43, 5,  sBuildings.ThinTower],
        [24, 5,  sBuildings.Entrance],
        [5,  5,  sBuildings.ThinTower],
        [5,  19, sBuildings.ThinTower],
      ];
      scene.addWall(wallPath, sStyles.templarWallStyle);
    } else if(castle_id == 2) {
      // Double castle
      $scope.showTilemap = false;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 45;
      var outerPath = [
        [5,  33, sBuildings.ThinTower],
        [62, 33, sBuildings.ThinTower],
        [62, 19, sBuildings.ThinTower],
        [62, 5,  sBuildings.ThinTower],
        [43, 5,  sBuildings.ThinTower],
        [24, 5,  sBuildings.Entrance],
        [5,  5,  sBuildings.ThinTower],
        [5,  19, sBuildings.ThinTower],
      ];
      var innerPath = [
        [20, 29, sBuildings.ThinTower],
        [34, 29, sBuildings.TowerCornerBuilding],
        [47, 29, sBuildings.ThinTower],
        [47, 13, sBuildings.ThinTower],
        [34, 13, sBuildings.Entrance],
        [20, 13, sBuildings.ThinTower],
      ]
      scene.addWall(outerPath, sStyles.lowStyle);
      scene.addWall(innerPath, sStyles.highStyle);
    } else if(castle_id == 3) {
      $scope.showTilemap = false;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 45;
      wallPath = [
        [5,  33],
        [30, 33],
        [30, 43],
        [45, 43],
        [45, 33],
        [62, 33],
        [62, 19],
        [43, 19],
        [43, 5],
        [24, 5],
        [5,  5],
        [5,  19],
      ];
      // Test: 
      scene.fillPath(wallPath, sMaterials.WATER_DIRT);
    }
    
    scene.render();

    $scope.getCastleTile = function(x, y) {
      return 5;
    }
    $scope.getStyle = sUtils.getStyle;
  });


/*
Next actions:
 * Add a way of "decorating the inside" of a courtyard with junk like
   trees or bushes or flowers
 * Make a castle or building that is just a weird shape

Done:  
 * Enable materials to color weird shapes
 * Refactor the "make castle" stuff so that you can pass arbitrary paths.
 * Move the rectangle-filling logic into methods on a material object
 * Directly pass sBuildings.Tower etc. as parameter on the declaration.

Architectural reflections:
  * A "building def" should be a function without parameters, that reads
    whatever extra stuff it wants from the "style"
 * Extra style should be an "addon", merged if necessary  
*/

