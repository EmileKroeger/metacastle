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
    $scope.getStyle = function(i, j) {
      console.debug([i, j]);
      var style = {left: (16 * i) + 'px'}
    }
    $scope.rows = [
      [1, 2, 3],
      [4, 5, 6],
    ];
  });
