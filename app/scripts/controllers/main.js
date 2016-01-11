'use strict';

/**
 * @ngdoc function
 * @name metacastleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the metacastleApp
 */
angular.module('metacastleApp')
  .controller('MainCtrl', function ($scope) {
    $scope.range = 
    function range(count) {
        return Array.apply(0, Array(count))
                    .map(function (element, index) { 
                             return index;  
                         });
    }
    
    function tilePos(tilecode) {
      var ti = tilecode % 100;
      var tj = Math.floor((tilecode - ti) / 100);
      return "-" + (17 * ti) + "px -" + (17 * tj) + "px";
    }
    
    $scope.getStyle = function(i, j) {
      var style = {
        left: (16 * i) + 'px',
        top: (16 * j) + 'px',
        "background-position": tilePos(100 * j + i),
      };
      return style;
    }
    $scope.rows = [
      [1, 2, 3],
      [4, 5, 6],
    ];
  });
