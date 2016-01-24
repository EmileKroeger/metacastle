'use strict';
angular.module('metacastleApp')
  .controller('MainCtrl', function ($scope, sUtils, sDisplay,
      sBuildingRenderers, sStyles) {
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

    var castle_id = 3;
    if (castle_id == 0) {
      var wallPath = [
        [5, 18, "tower"],
        [14, 18, "dungeon"],
        [24, 18, "tower"],
        [24, 4, "tower"],
        [14, 4, "entrance"],
        [5, 4, "tower"],
      ];
      scene.addWall(wallPath, sStyles.templarWallStyle);
    } if(castle_id == 1) {
      // Big awkwardly-shaped castle
      $scope.showTilemap = false;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 45;
      wallPath = [
        [5, 33, "tower"],
        [30, 33, "dungeon", sStyles.templarDungeonStyle],
        [62, 33, "tower"],
        [62, 19, "tower"],
        [43, 19, "tower"],
        [43, 5, "tower"],
        [24, 5, "entrance"],
        [5, 5, "tower"],
        [5, 19, "tower"],
      ];
      scene.addWall(wallPath, sStyles.templarWallStyle);
    } else if(castle_id == 2) {
      // Double castle
      $scope.showTilemap = false;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 45;
      var outerPath = [
        [5, 33, "tower"],
        [62, 33, "tower"],
        [62, 19, "tower"],
        [62, 5, "tower"],
        [43, 5, "tower"],
        [24, 5, "entrance"],
        [5, 5, "tower"],
        [5, 19, "tower"],
      ];
      var innerPath = [
        [20, 29, "tower"],
        [34, 29, "dungeon"],
        [47, 29, "tower"],
        [47, 13, "tower"],
        [34, 13, "entrance"],
        [20, 13, "tower"],
      ]
      scene.addWall(outerPath, sStyles.lowStyle);
      scene.addWall(innerPath, sStyles.highStyle);
    } else if(castle_id == 3) {
      $scope.showTilemap = false;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 45;
      wallPath = [
        [5, 33, "tower"],
        [30, 33, "dungeon", sStyles.templarDungeonStyle],
        [62, 33, "tower"],
        [62, 19, "tower"],
        [43, 19, "tower"],
        [43, 5, "tower"],
        [24, 5, "entrance"],
        [5, 5, "tower"],
        [5, 19, "tower"],
      ];
      // Test: 
      scene.addPath(wallPath, sStyles.defaultStyle.crenelationMaterial);
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
 * Enable materials to color weird shapes
 * Directly pass sBuildings.tower etc. as parameter on the declaration.

Done:  
 * Refactor the "make castle" stuff so that you can pass arbitrary paths.
 * Move the rectangle-filling logic into methods on a material object

Architectural reflections:
  * A "building def" should be a function without parameters, that reads
    whatever extra stuff it wants from the "style"
 * Extra style should be an "addon", merged if necessary  
*/

