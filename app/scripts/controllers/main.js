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

    var templarWallStyle = sStyles.combine(sStyles.templarWallStyle);
    var templarDungeonStyle = sStyles.combine(sStyles.templarDungeonStyle,
    sStyles.templarWallStyle);

    
    // Now all of this should be parametric:
    var wallPath = [
      [5, 18, "tower"],
      [14, 18, "dungeon"],
      [24, 18, "tower"],
      [24, 4, "tower"],
      [14, 4, "entrance"],
      [5, 4, "tower"],
    ];
    
    var big_castle = 1;
    if(big_castle) {
      $scope.showTilemap = false;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 70;
      wallPath = [
        [5, 58, "tower"],
        [30, 58, "dungeon", templarDungeonStyle],
        [62, 58, "tower"],
        [62, 44, "tower"],
        [43, 44, "tower"],
        [43, 30, "tower"],
        [24, 30, "entrance"],
        [5, 30, "tower"],
        [5, 44, "tower"],
      ];
    }
    //sBuildingRenderers.fillPath(wallPath, 9)
    //console.debug(wallPath);
    
    //var dungeonStyle = sStyles.combine(sStyles.dungeonStyle);
    //sBuildingRenderers.makeCastle(sStyles.defaultStyle, wallPath, dungeonStyle);

    
    sBuildingRenderers.makeCastle(templarWallStyle, wallPath, templarDungeonStyle);

    $scope.getCastleTile = function(x, y) {
      return 5;
    }
    $scope.getStyle = sUtils.getStyle;
  });
