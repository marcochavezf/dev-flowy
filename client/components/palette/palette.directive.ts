angular.module('devFlowyApp')
  .directive('draw2dPalette', ['$window', '$parse', '$timeout', function ($window, $parse, $timeout) {
  return {
    restrict: 'E,A',
    link: function (scope, element, attrs, controller) {

      // $timeout is used just to ensure that the template is rendered if we want access them
      // (leave the render cycle)
      $timeout(function () {
        $('.draw2d_droppable').draggable({
          appendTo: 'body',
          stack: 'body',
          zIndex: 27000,
          helper: 'clone',
          drag: (event, ui) => undefined,
          stop: (e, ui) => undefined,
          start: (e, ui) => $(ui.helper).addClass('shadow')
        });
      }, 0);
    },
    templateUrl: 'components/palette/palette.html'
  };
}]);

