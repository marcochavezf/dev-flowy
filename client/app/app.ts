'use strict';

angular.module('devFlowyApp', [
  'devFlowyApp.auth',
  'devFlowyApp.admin',
  'devFlowyApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode({enabled: true, requireBase: false});
  });
