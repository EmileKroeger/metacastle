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
    $scope.getTilemapTile = function(i, j) {
      return 100 * j + i;
    }
    
    $scope.getStyle = sUtils.getStyle;
  });
