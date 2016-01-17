'use strict';

/**
 * @ngdoc service
 * @name metacastleApp.sStyles
 * @description
 * # sStyles
 * Service in the metacastleApp.
 */
angular.module('metacastleApp')
  .service('sStyles', function(sMaterials, sBuildings, sDecorations, sDecorators) {
    var sStyles = this;
    this.defaultStyle = {
      wallMaterial: sMaterials.BLUEWALLS,
      crenelationMaterial: sMaterials.BLUECRENELATION,
      platformTile: 9,
      groundTile: 106, // dirt
      //groundTile: 703, // red flowers
      //groundTile: 1608, // rock
      gate: sDecorations.wideWoodenGate,
      door: sDecorations.roundedWoodenGratedDoor,
      window: sDecorations.greySlit,
      trapdoor: sDecorations.blueStairsDown,
      towerHeight: 10,
      curtainWallHeight: 5,
      towerFunc: sBuildings.thinTower,
      //tallBanner: sDecorations.tallRedBannerCross,
      tallBanner: sDecorations.tallGreenBanner,
      towerDecorators: {
        facade: sDecorators.highWindowsDecorator,
        platform: sDecorators.trapdoorDecorator,
      },
      entranceDecorators: {
        facade: sDecorators.fancyGateDecorator,
        platform: sDecorators.trapdoorDecorator,
      },
      dungeonDecorators: {
        facade: sDecorators.windowedGateDecorator,
      },
      //towerFunc: sBuildings.tinyTower,
      //dungeonFunc: sBuildings.buildingWithHat,
      dungeonFunc: sBuildings.towerCornerBuilding,
    };
    
    this.lowStyle = {
      towerHeight: 5,
      curtainWallHeight: 3,
      towerDecorators: {
        platform: sDecorators.trapdoorDecorator,
      },
    };
    
    this.highStyle = {
      towerHeight: 11,
      curtainWallHeight: 8,
    }
    
    
    this.dungeonStyle = {
      window: sDecorations.greyRoundedWindow,
    };
    
    
    this.templarWallStyle = {
      gate: sDecorations.wideSteelSquareGratedGate,
      door: sDecorations.squareSteelGratedDoor,
      window: sDecorations.greyCrossSlit,
      tallBanner: sDecorations.tallRedBannerCross,
    }
    this.templarDungeonStyle = {
      window: sDecorations.greyGothicWindow,
    }
    
    
    this.combine = function() {
      var style = angular.extend({}, sStyles.defaultStyle);
      for (var i = arguments.length - 1; i >= 0; i -= 1) {
        angular.extend(style, arguments[i]);
      }
      return style;
    }
  });
