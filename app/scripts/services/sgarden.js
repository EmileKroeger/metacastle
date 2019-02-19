'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sGarden
 * @description
 * # sGarden
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
  .service('sGarden', function sGarden(sStyles, sBuildings, sUtils,
      sDecorators, sDecorations, sMaterials) {
    // AngularJS will instantiate a singleton by calling "new" on this function
        var FLOWERS_STYLE = {
          flowers: [
            sMaterials.BLUEFLOWERS,
            sMaterials.REDFLOWERS,
            sMaterials.WHITEFLOWERS,
          ],
        }
        this.garden = function(scene) {
          scene.wid = 30;
          scene.hei = 30;
          scene.addStyle(FLOWERS_STYLE)
          var gardenRect = {
            x: 1,
            y: 1,
            wid: 28,
            hei: 28,
          }
          //populateWithFlowers(scene, gardenRect);
          //scene.scatterBuildings(rect, sBuildings.House);
          var flowers = sUtils.choice(scene.style.flowers);
          //flowers.fillRect(sUtils.nibble(gardenRect));
          var gardenPath = sUtils.makeCrossPath(5, 5, 10, 10, 3, 3);
          sMaterials.BLUEWHITEFLOWERS.fillPath(gardenPath);
          var gardenPath = sUtils.makeCrossPath(7, 7, 6, 6, 3, 3);
          sMaterials.WATER_STONE.fillPath(gardenPath);
          var gardenPath = sUtils.makeCrossPath(9, 9, 2, 2, 3, 3);
          sMaterials.REDWHITEFLOWERS.fillPath(gardenPath);
          //sMaterials.BLUEFLOWERS.drawEdge(gardenPath);
        }
      });
