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
    
    function getLayout() {
      var BIGRECTWALLS = [
        [5,  33, sBuildings.ThinTower],
        [62, 33, sBuildings.ThinTower],
        [62, 19, sBuildings.ThinTower],
        [62, 5,  sBuildings.ThinTower],
        [43, 5,  sBuildings.ThinTower],
        [24, 5,  sBuildings.Entrance, getEntranceStyle()],
        [5,  5,  sBuildings.ThinTower],
        [5,  19, sBuildings.ThinTower],
      ];
      // These could take some random params
      var KEEPLEFT = {
        keeprect: {
          x: 8,
          y: 11,
          wid: 34,
          hei: 21,
        },
        courtrects: [
          {
            x: 41,
            y: 7,
            wid: 19,
            hei: 25,
          },
          {
            x: 8,
            y: 7,
            wid: 16,
            hei: 6,
          },
          {
            x: 27,
            y: 7,
            wid: 14,
            hei: 6,
          },
        ],
        walls: BIGRECTWALLS,
      }
      var KEEPRIGHT = {
        keeprect: {
          x: 26,
          y: 11,
          wid: 34,
          hei: 21,
        },
        courtrects: [
          {
            x: 8,
            y: 7,
            wid: 19,
            hei: 25,
          },
          {
            x: 26,
            y: 7,
            wid: 17,
            hei: 6,
          },
          {
            x: 45,
            y: 7,
            wid: 16,
            hei: 6,
          },
        ],
        walls: BIGRECTWALLS,
      }
      var KEEPMID = {
        keeprect: {
          x: 17,
          y: 11,
          wid: 34,
          hei: 21,
        },
        courtrects: [
          {
            x: 8,
            y: 7,
            wid: 10,
            hei: 25,
          },
          {
            x: 50,
            y: 7,
            wid: 10,
            hei: 25,
          },
          {
            x: 18,
            y: 7,
            wid: 16,
            hei: 6,
          },
          {
            x: 36,
            y: 7,
            wid: 14,
            hei: 6,
          },
        ],
        walls: BIGRECTWALLS,
      }
      var layouts = [
        KEEPLEFT,
        KEEPRIGHT,
        KEEPMID,
      ];
      return sUtils.choice(layouts);
    }
    
    function populateWithHouses(scene, rect) {
      scene.scatterBuildings(rect, sBuildings.House);
    }
    
    function nibble(rect) {
      return {
        x: rect.x + 1,
        y: rect.y + 1,
        wid: rect.wid - 2,
        hei: rect.hei - 2,
      };
    }
    
    function populateWithFlowers(scene, rect) {
      var flowers = sUtils.choice(scene.style.flowers);
      flowers.fillRect(nibble(rect));
    }
    
    function transpose(rect) {
      return {
        x: rect.y,
        y: rect.x,
        wid: rect.hei,
        hei: rect.wid,
      };
    }
    
    function subdivideAndJoin(rects) {
      var subdivided = [];
      rects.forEach(function(rect) {
        subdivide(rect).forEach(function(subr) {
          subdivided.push(subr);
        });
      });
      return subdivided;
    }
    
    function subdivide(rect) {
      if(sUtils.choice([true, false, false])) {
        // Sometimes randomly don't subdivide
        return [rect];
      } else if (rect.wid < rect.hei) {
        return subdivide(transpose(rect)).map(transpose);
      } else if (rect.wid < 8) {
        // wider, but not enough - don't subdivide
        return [rect];
      } else {
        // rect is very wide.
        var leftWid = 4 + sUtils.pseudoRandomInt(rect.wid - 7);
        var left = angular.extend({}, rect);
        left.wid = leftWid;
        var right = angular.extend({}, rect);
        right.x += leftWid;
        right.wid = rect.wid - leftWid;
        return subdivideAndJoin([left, right]);
      }
    }
    
    this.doubleWallCastle = function(scene) {
      scene.wid = 70;
      scene.hei = 45;
      addStyles(scene);
      var layout = getLayout();
      scene.addWall(layout.walls, sStyles.lowStyle);

      var innerPath = [
        [3, 20, sBuildings.ThinTower],
        [17, 20, getDungeon(), getDungeonStyle()],
        [30, 20, sBuildings.ThinTower],
        [30, 4, sBuildings.ThinTower],
        [17, 4, sBuildings.Entrance, getEntranceStyle()],
        [3, 4, sBuildings.ThinTower],
      ];
      offsetPath(innerPath, layout.keeprect);
      scene.addWall(innerPath, sStyles.highStyle);
      
      if (sUtils.choice([true, false])) {
        subdivideAndJoin(layout.courtrects).forEach(function(rect) {
          populateWithFlowers(scene, rect);
        });
        
      } else {
        layout.courtrects.forEach(function(rect) {
          populateWithHouses(scene, rect);
        });
      }
    }
  });
