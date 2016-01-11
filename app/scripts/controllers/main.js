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
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
