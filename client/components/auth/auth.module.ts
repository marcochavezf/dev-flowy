'use strict';

angular.module('devFlowyApp.auth', [
  'devFlowyApp.constants',
  'devFlowyApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
