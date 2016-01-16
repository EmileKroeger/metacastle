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
    
    // Now all of this should be parametric:
    var wallPath = [
      [5, 18],
      [24, 18],
      [24, 4],
      [5, 4],
    ];
    
    var dungeonStyle = sStyles.combine(sStyles.dungeonStyle);
    
    sBuildingRenderers.makeCastle(sStyles.defaultStyle, wallPath, dungeonStyle);

    $scope.getCastleTile = function(x, y) {
      return 5;
    }
    $scope.getStyle = sUtils.getStyle;
  });
