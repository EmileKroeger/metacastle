'use strict';
angular.module('metacastleApp')
  .service('sUtils', function () {
    this.range = function(count) {
        return Array.apply(0, Array(count))
                    .map(function (element, index) { 
                             return index;  
                         });
    }
    self = this;
    this.tilePos = function tilePos(tilecode) {
      var ti = tilecode % 100;
      var tj = Math.floor((tilecode - ti) / 100);
      return "-" + (17 * ti) + "px -" + (17 * tj) + "px";
    }
    this.getStyle = function(i, j, tilecode) {
      var style = {
        left: (16 * i) + 'px',
        top: (16 * j) + 'px',
        "background-position": self.tilePos(tilecode),
      };
      return style;
    };
  })
  .controller('MainCtrl', function ($scope, sUtils) {
    $scope.range = sUtils.range;
    $scope.getTilemapTile = function(x, y) {
      // Return the tile code from the same place
      return 100 * (30 - y) + x;
    }
    $scope.CASTLEWID = 30;
    $scope.CASTLEHEI = 30;
    
    var tiles = {}
    
    function addRect(x0, y0, wid, hei, kind) {
      for (var dx = 0; dx < wid; dx++) {
        for (var dy = 0; dy < hei; dy++) {
          tiles[[x0+dx, y0+dy]] = kind;
        }
      }
    }
    addRect(10, 10, 10, 10, 1424);

    $scope.getCastleTile = function(x, y) {
      var tile = tiles[[x, y]];
      if (tile) {
        return tile;
      } else {
        return 0;
      }
      if (x < 10) {
        return 0;
      }
      else if (x < 20) {
        return 1424;
      }
      return 0;
    }
    
    $scope.getStyle = sUtils.getStyle;
  });
