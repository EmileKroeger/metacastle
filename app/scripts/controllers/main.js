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
    
    // Now all of this should be parametric:
    var wallPath = [
      [5, 18],
      [24, 18],
      [24, 4],
      [5, 4],
    ];
    
    var big_castle = 0;
    if(big_castle) {
      $scope.showTilemap = true;
      $scope.CASTLEWID = 70;
      $scope.CASTLEHEI = 70;
      wallPath = [
        [5, 58],
        [62, 58],
        [62, 44],
        [43, 44],
        [43, 30],
        [24, 30],
        [5, 30],
        [5, 44],
      ];
    }
    //sBuildingRenderers.fillPath(wallPath, 9)
    //console.debug(wallPath);
    
    //var dungeonStyle = sStyles.combine(sStyles.dungeonStyle);
    //sBuildingRenderers.makeCastle(sStyles.defaultStyle, wallPath, dungeonStyle);

    var templarWallStyle = sStyles.combine(sStyles.templarWallStyle);
    var templarDungeonStyle = sStyles.combine(sStyles.templarDungeonStyle,
    sStyles.templarWallStyle);
    
    sBuildingRenderers.makeCastle(templarWallStyle, wallPath, templarDungeonStyle);

    $scope.getCastleTile = function(x, y) {
      return 5;
    }
    $scope.getStyle = sUtils.getStyle;
  });
