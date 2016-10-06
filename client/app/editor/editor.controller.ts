/* jshint evil:true */
'use strict';

function createConnection(sourcePort, targetPort) {

  var conn = new draw2d.Connection();
  conn.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());
  //conn.setOutlineStroke(1);
  //conn.setOutlineColor('#303030');
  conn.setStroke(2);
  conn.setRadius(5);
  conn.setColor('#787878');

  return conn;

}

var BetweenFigure = draw2d.shape.node.Between.extend({

  init : function(attr)
  {
    this._super(attr);
  },

  /**
   * @method
   * Called if the user drop this element onto the dropTarget.
   *
   * In this Example we create a 'smart insert' of an existing connection.
   * COOL and fast network editing.
   *
   * @param {draw2d.Figure} dropTarget The drop target.
   * @param {Number} x the x coordinate of the drop
   * @param {Number} y the y coordinate of the drop
   * @param {Boolean} shiftKey true if the shift key has been pressed during this event
   * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
   * @private
   **/
  onDrop: function(dropTarget, x, y, shiftKey, ctrlKey)
  {
    // Activate a 'smart insert' If the user drop this figure on connection
    //
    if (dropTarget instanceof draw2d.Connection) {
      var oldSource = dropTarget.getSource();
      dropTarget.setSource(this.getOutputPort(0));

      var additionalConnection = createConnection(null, null);
      this.getCanvas().add(additionalConnection);
      additionalConnection.setSource(oldSource);
      additionalConnection.setTarget(this.getInputPort(0));
    }
  }

});

(function () {

  class EditorController {
    constructor($scope, $http) {
      //TODO: move this code to $onInit()
      var editor = ace.edit('editor');
      editor.setTheme('ace/theme/monokai');
      editor.getSession().setMode('ace/mode/javascript');

      $scope.editor = {
        // Configuration of the editor
        //
        //
        canvas: {
          // callback if a DOM node from the palette is dropped inside the canvas
          //
          onDrop: function (dropTarget, x, y, shiftKey, ctrlKey) {
            var figure = new BetweenFigure({ resizeable: false });
            $http.post('/api/nodes', { draw2dId: figure.id }).then(response => {
              var node = response.data;
              //var figure = new draw2d.shape.node.Between();
              figure.userData = { nodeId: node._id };
              figure.installEditPolicy(new draw2d.policy.figure.GlowSelectionFeedbackPolicy());
              // create a command for the undo/redo support
              var command = new draw2d.command.CommandAdd(this, figure, x, y);
              this.getCommandStack().execute(command);

              this.add(figure);
            });
          }
        },

        // provide all figurs to show in the left hand palette
        // Used by the directrives/canvas.js
        palette: {
          figures: [
            {class: 'draw2d.shape.node.Between', name: 'Drag me'}
          ]
        },
        ace: editor,
        hasCodeChanges: false
      };
    }
    /*
    $onInit() {
    }
    */
  }
  angular.module('devFlowyApp')
    .component('editor', {
      templateUrl: 'app/editor/editor.html',
      controller: EditorController
    });

})();
