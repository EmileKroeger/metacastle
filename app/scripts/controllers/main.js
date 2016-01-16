'use strict';
angular.module('metacastleApp')
  .controller('MainCtrl', function ($scope, sUtils, sMaterials, sDisplay,
      sBuildings, sBuildingRenderers) {
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

    var aStyle = {
      wallMaterial: sMaterials.BLUEWALLS,
      crenelationMaterial: sMaterials.BLUECRENELATION,
      platformTile: 9,
      groundTile: 106, // dirt
      gateL: 632,
      gateR: 633,
      door: 33,
      window: 845,
      trapdoor: 1829,
      towerHeight: 10,
      curtainWallHeight: 5,
      towerFunc: sBuildings.thinTower,
      //towerFunc: sBuildings.tinyTower,
      //dungeonFunc: sBuildings.buildingWithHat,
      dungeonFunc: sBuildings.towerCornerBuilding,
    };
    
    sBuildingRenderers.makeCastle(aStyle, wallPath);

    $scope.getCastleTile = function(x, y) {
      return 5;
    }
    $scope.getStyle = sUtils.getStyle;
  });
