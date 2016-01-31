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
      platformMaterial: sMaterials.BLUEPLATFORM,
      platformTile: 9,
      groundTile: 106, // dirt
      basicTerrain: [5, 105], // grass
      groundDecoration: sDecorations.randomWorkItem,
      //groundTile: 703, // red flowers
      //groundTile: 1608, // rock
      gate: sDecorations.wideWoodenGate,
      door: sDecorations.roundedWoodenGratedDoor,
      window: sDecorations.greySlit,
      trapdoor: sDecorations.blueStairsDown,
      towerHeight: 10,
      curtainWallHeight: 5,
      towerFunc: sBuildings.thinTower,
      fancyTallBanner: sDecorations.tallRedBannerCross,
      basicTallBanner: sDecorations.tallRedBanner,
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
      dungeonFunc: sBuildings.towerCornerBuilding,
    };
    
    this.redFlagsStyle = {
      fancyTallBanner: sDecorations.tallRedBannerCross,
      basicTallBanner: sDecorations.tallRedBanner,
    }

    this.greenFlagsStyle = {
      fancyTallBanner: sDecorations.tallGreenBannerCross,
      basicTallBanner: sDecorations.tallGreenBanner,
    }
    
    this.blueFlagsStyle = {
      fancyTallBanner: sDecorations.tallBlueBannerCross,
      basicTallBanner: sDecorations.tallBlueBanner,
    }
    
    this.yellowStyle = {
      wallMaterial: sMaterials.YELLOWWALLS,
      crenelationMaterial: sMaterials.YELLOWCRENELATION,
      platformTile: 207,
      trapdoor: sDecorations.yellowStairsDown,
      basicTerrain: [8, 108], // sand
      window: sDecorations.yellowSlit,
    }
    
    this.greyStyle = {
      wallMaterial: sMaterials.GREYWALLS,
      crenelationMaterial: sMaterials.GREYCRENELATION,
      platformTile: 206,
      trapdoor: sDecorations.greyStairsDown,
    }
    
    this.blueStyle = {
      wallMaterial: sMaterials.BLUEWALLS,
      crenelationMaterial: sMaterials.BLUECRENELATION,
      platformTile: 9,
      trapdoor: sDecorations.blueStairsDown,
    }
    
    this.brownStyle = {
      wallMaterial: sMaterials.BROWNWALLS,
      crenelationMaterial: sMaterials.BROWNCRENELATION,
      platformTile: 205,
      trapdoor: sDecorations.brownStairsDown,
      basicTerrain: [8, 108], // sand
      window: sDecorations.yellowSlit,
    }
    
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
