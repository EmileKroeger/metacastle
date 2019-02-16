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
          function makeCross(x0, y0, midx, midy, ex, ey) {
            var xa = x0;
            var xb = x0 + ex;
            var xc = x0 + ex + midx;
            var xd = x0 + ex + midx + ex;
            var ya = y0;
            var yb = y0 + ey;
            var yc = y0 + ey + midy;
            var yd = y0 + ey + midy + ey;
            return [
              [xa, yb],
              [xa, yc],
              [xb, yc],
              [xb, yd],
              [xc, yd],
              [xc, yc],
              [xd, yc],
              [xd, yb],
              [xc, yb],
              [xc, ya],
              [xb, ya],
              [xb, yb],
            ];
          }
          var gardenPath = makeCross(5, 5, 10, 10, 3, 3);
          //flowers.drawEdge(gardenPath);
          sMaterials.WHITEFLOWERS.fillPath(gardenPath);
          sMaterials.REDFLOWERS.drawEdge(gardenPath);
          var gardenPath = makeCross(7, 7, 6, 6, 3, 3);
          //flowers.drawEdge(gardenPath);
          sMaterials.WHITEFLOWERS.fillPath(gardenPath);
          sMaterials.BLUEFLOWERS.drawEdge(gardenPath);
        }
      });
