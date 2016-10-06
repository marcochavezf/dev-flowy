'use strict';

angular.module('devFlowyApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('editor', {
        url: '/editor',
        template: '<editor></editor>'
      });
  });
