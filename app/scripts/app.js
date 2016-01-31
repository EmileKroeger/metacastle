'use strict';

/**
 * @ngdoc overview
 * @name metacastleApp
 * @description
 * # metacastleApp
 *
 * Main module of the application.
 */
angular
  .module('metacastleApp', [
    //'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/menu.html', 
      })
      .when('/small/', {
        templateUrl: 'views/main.html', 
        controller: 'MainCtrl'})
      .when('/large/', {
        templateUrl: 'views/main.html', 
        controller: 'MainCtrl'})
      .when('/debug/', {
        templateUrl: 'views/debug.html', 
        controller: 'MainCtrl'})
      .otherwise({redirectTo: '/'});
  }]);

