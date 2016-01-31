'use strict';
angular.module('metacastleApp')
  .controller('MainCtrl', function ($scope, $routeParams, sUtils, sDisplay,
      sBuildings, sBuildingRenderers, sStyles, sMaterials, sCastles) {
    $scope.range = sUtils.range;
    $scope.getTilemapTile = function(x, y) {
      // Return the tile code from the same place
      return 100 * (30 - y) + x;
    }
    sDisplay.clear();
    $scope.tiles = sDisplay.tiles;

    var scene = new sBuildingRenderers.Scene();

    // Very ugly but gets the job done
    var hash = window.location.hash;
    if (hash == "#/large/") {
      sCastles.doubleWallCastle(scene);
      //sCastles.bigCourtyardCastle(scene);
    } else if ((hash == "#/debug/") || (hash == "#/small/")) {
      sCastles.smallCastle(scene);
    } else if(false) {
      // EXperiments
      scene.wid = 70;
      scene.hei = 45;
      var path = [
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
      scene.fillPath(path, sMaterials.WATER_DIRT);
    }

    $scope.CASTLEWID = scene.wid;
    $scope.CASTLEHEI = scene.hei;
    scene.render();

    $scope.getCastleTile = function(x, y) {
      return scene.getBackgroundTile(x, y);
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

