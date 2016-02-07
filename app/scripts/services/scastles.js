'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sCastles
 * @description
 * # sCastles
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
  .service('sCastles', function sCastles(sStyles, sBuildings, sUtils,
      sDecorators, sDecorations, sMaterials) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        
    var getDungeon = function() {
      // for tests:
      //return sBuildings.House;
      return sUtils.choice([
        sBuildings.TowerCornerBuilding,
        sBuildings.TowerCornerBuilding,
        sBuildings.TallDungeon,
        sBuildings.BroadDungeon,
        //sBuildings.CrossDungeon, // Not quite ready
        sBuildings.BigAssZiggurat,
      ]);
    };
    
    function getMaterialStyle() {
      return sUtils.choice([
        sStyles.yellowStyle,
        sStyles.greyStyle,
        sStyles.blueStyle,
        sStyles.brownStyle,
      ]);
    };
    
    function getFlagStyle() {
      return sUtils.choice([
        sStyles.redFlagsStyle,
        sStyles.blueFlagsStyle,
        sStyles.greenFlagsStyle,
      ]);
    }
    
    function getEntranceStyle() {
      var decorator = sUtils.choice([
        sDecorators.gateDecorator,
        sDecorators.windowedGateDecorator,
        sDecorators.fancyGateDecorator,
      ]);
      return {
        entranceDecorators: {
          facade: decorator,
          platform: sDecorators.trapdoorDecorator,
        },
      };
    }
    
    function getTowerStyle() {
      var decorator = sUtils.choice([
        sDecorators.singleHighWindowDecorator,
        sDecorators.manyHighWindowsDecorator,
        sDecorators.highWindowsDecorator,
        sDecorators.highWindowsDecorator,
        sDecorators.bannersAndWindowsDecorators,
      ]);
      return {
        towerDecorators: {
          facade: decorator,
          platform: sDecorators.trapdoorDecorator,
        },
      };
    }
    function getDungeonDecoStyle() {
      return sUtils.choice([
        sStyles.dungeonStyle,
        sStyles.templarDungeonStyle,
      ]);
    };
    function getDungeonStyle() {
      var style = getDungeonDecoStyle();
      var decorator = sUtils.choice([
        sDecorators.windowedGateDecorator,
        sDecorators.manyWindowedGateDecorator,
      ]);
      //decorator = sDecorators.manyWindowedGateDecorator;
      style.dungeonDecorators = {
          facade: decorator,
      };
      // Window
      var windowDec = sUtils.choice([
        sDecorations.greyGothicWindow,
        sDecorations.greyPointyWindow,
        sDecorations.greyAngledWindow,
        sDecorations.greySquareWindow,
        sDecorations.greyRoundedWindow,
        sDecorations.greyRomanWindow,
      ]);
      style.window = windowDec;
      return style;
      //return {
      //  dungeonDecorators: {
      //    facade: decorator,
      //  },
      //};
    }
    
    function addStyles(scene) {
      scene.addStyle(getMaterialStyle());
      scene.addStyle(getFlagStyle());
      scene.addStyle(getTowerStyle());
    }
    
    this.smallCastle = function(scene) {
      scene.wid = 30;
      scene.hei = 30;
      addStyles(scene);
      var wallPath = [
        [5,  18, sBuildings.ThinTower],
        [14, 18, getDungeon(), getDungeonStyle()],
        [24, 18, sBuildings.ThinTower],
        [24, 4,  sBuildings.ThinTower],
        [14, 4,  sBuildings.Entrance, getEntranceStyle()],
        [5,  4,  sBuildings.ThinTower],
      ];
      scene.addWall(wallPath);
    }
    this.bigCourtyardCastle = function(scene) {
      scene.wid = 70;
      scene.hei = 45;
      addStyles(scene);
      var wallPath = [
        [5,  33, sBuildings.ThinTower],
        [30, 33, getDungeon(), getDungeonStyle()],
        [62, 33, sBuildings.ThinTower],
        [62, 19, sBuildings.ThinTower],
        [43, 19, sBuildings.ThinTower],
        [43, 5,  sBuildings.ThinTower],
        [24, 5,  sBuildings.Entrance, getEntranceStyle()],
        [5,  5,  sBuildings.ThinTower],
        [5,  19, sBuildings.ThinTower],
      ];
      scene.addWall(wallPath);
    }

    function offsetPath(path, rectangle) {
      path.forEach(function(item) {
        item[0] += rectangle.x;
        item[1] += rectangle.y;
      });
    }
    
    
    function fillRectangle(scene, rectangle, include_keep) {
      if (include_keep) {
        var innerPath = [
          [3, 20, sBuildings.ThinTower],
          [17, 20, getDungeon(), getDungeonStyle()],
          [30, 20, sBuildings.ThinTower],
          [30, 4, sBuildings.ThinTower],
          [17, 4, sBuildings.Entrance, getEntranceStyle()],
          [3, 4, sBuildings.ThinTower],
        ];
        offsetPath(innerPath, rectangle);
        scene.addWall(innerPath, sStyles.highStyle);
        var used = 34;
        var remains = {
          x: rectangle.x + used,
          y: rectangle.y,
          wid: rectangle.wid - used,
          hei: rectangle.hei,
        }
        fillRectangle(scene, remains, false);
      } else {
        // TODO: simple flood fill.
        scene.scatterBuildings(rectangle, sBuildings.House);
        /*
        scene.renderers.push({
          x: rectangle.x,
          y: rectangle.y,
          render: function() {
            sMaterials.BLUECRENELATION.fillRect(rectangle);
          }
        });
        */
      }
    }
    
    this.doubleWallCastle = function(scene) {
      scene.wid = 70;
      scene.hei = 45;
      addStyles(scene);
      var outerPath = [
        [5,  33, sBuildings.ThinTower],
        [62, 33, sBuildings.ThinTower],
        [62, 19, sBuildings.ThinTower],
        [62, 5,  sBuildings.ThinTower],
        [43, 5,  sBuildings.ThinTower],
        [24, 5,  sBuildings.Entrance, getEntranceStyle()],
        [5,  5,  sBuildings.ThinTower],
        [5,  19, sBuildings.ThinTower],
      ];
      scene.addWall(outerPath, sStyles.lowStyle);
      var innerRectangle = {
        x: 8,
        y: 9,
        wid: 52,
        hei: 23,
      }
      fillRectangle(scene, innerRectangle, true);
    }
  });
