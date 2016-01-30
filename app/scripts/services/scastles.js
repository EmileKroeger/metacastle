'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sCastles
 * @description
 * # sCastles
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
  .service('sCastles', function sCastles(sStyles, sBuildings) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
    function choice(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
    
    var getDungeon = function() {
      return choice([
        sBuildings.TowerCornerBuilding,
        sBuildings.TowerCornerBuilding,
        sBuildings.TallDungeon,
        sBuildings.BroadDungeon,
        //sBuildings.CrossDungeon, // Not quite ready
        sBuildings.BigAssZiggurat,
      ]);
      /*
      var flip = Math.floor(Math.random() * 3);
      if (flip == 0) {
        return sBuildings.BigAssZiggurat;
      } else if (flip == 1) {
        return sBuildings.CrossDungeon;
      } else {
        return sBuildings.TowerCornerBuilding;
      }
      */
    }
    
    this.smallCastle = function(scene) {
      scene.wid = 30;
      scene.hei = 30;
      var wallPath = [
        [5,  18, sBuildings.ThinTower],
        [14, 18, getDungeon()],
        //[14, 18, sBuildings.TallDungeon],
        [24, 18, sBuildings.ThinTower],
        [24, 4,  sBuildings.ThinTower],
        [14, 4,  sBuildings.Entrance],
        [5,  4,  sBuildings.ThinTower],
      ];
      var style = sStyles.yellowStyle;
      scene.addWall(wallPath, style);
      scene.style = style;
    }
    this.bigCourtyardCastle = function(scene) {
      scene.wid = 70;
      scene.hei = 45;
      var wallPath = [
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
      scene.addWall(wallPath, sStyles.brownStyle);
    }
    this.doubleWallCastle = function(scene) {
      scene.wid = 70;
      scene.hei = 45;
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
    }
  });