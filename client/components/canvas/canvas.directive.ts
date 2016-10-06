angular.module('devFlowyApp')
  .directive('draw2dCanvas', function ($window, $parse, $timeout, $http) {

  return {
    restrict: 'E,A',
    link: function (scope, element, attrs, controller) {

      // provide the scope properties and override the defaults with the user settings
      //
      scope.editor = $.extend(true, {
        canvas: {
          //width: 1000,
          //height: 500,
          onDrop: (droppedDomNode, x, y, shiftKey, ctrlKey) => undefined
        },
        palette: {
          figures: []
        },
        state: {
          dirty: false,
          canUndo: false,
          canRedo: false
        },
        selection: {
          className: null,
          figure: null,
          attr: null
        }

      }, scope.editor);

      // init the Draw2D Canvas with the given user settings and overriden hooks
      //
      var canvas = new draw2d.Canvas(element.attr('id'), scope.editor.canvas.width, scope.editor.canvas.height);
      canvas.installEditPolicy(  new draw2d.policy.connection.DragConnectionCreatePolicy({
        createConnection: createConnection }));
      canvas.installEditPolicy( new draw2d.policy.canvas.SnapToGeometryEditPolicy());
      canvas.installEditPolicy( new draw2d.policy.canvas.SnapToInBetweenEditPolicy());
      canvas.installEditPolicy( new draw2d.policy.canvas.SnapToCenterEditPolicy());

      // The interceptor allows that a figure is droppable to a connection
      //canvas.installEditPolicy(new MyInterceptorPolicy());

      //canvas.setScrollArea('#' + element.attr('id'));
      canvas.onDrop = $.proxy(scope.editor.canvas.onDrop, canvas);

      //TODO: (refactor) create a service to retrieve service
      //Retrieve saved figures and connections
      var service;
      $http.get('/api/services').then(response => {
        service = response.data[0];
        if (typeof service === 'undefined') {
          return;
        }
        //console.log('total elements: ' + service.draw2dContent.length);
        scope.editor.load(service.draw2dContent);

        for (var d2dElem of service.draw2dContent){
          var type = d2dElem.type.split('.');
          if (type[2] !== 'node') {
            continue;
          }

          var figure = canvas.getFigure(d2dElem.id);
          figure.setResizeable(false);
          figure.setStroke(1);
          figure.installEditPolicy(new draw2d.policy.figure.GlowSelectionFeedbackPolicy());
        }
      });

      // update the scope model with the current state of the
      // CommandStack
      var writer = new draw2d.io.json.Writer();
      var stack = canvas.getCommandStack();
      stack.addEventListener(function (event) {
        $timeout(function () {
          scope.editor.state.canUndo = stack.canUndo();
          scope.editor.state.canRedo = stack.canRedo();
        }, 0);
        if (event.isPostChangeEvent()) {
          writer.marshal(canvas, (json) => {
            if (_.isEmpty(json)) {
              return;
            }
            $http.put('/api/services/' + service._id, {draw2dContent: json})
              .then(response => undefined);
          });
        }
      });

      // Update the selection in the model
      // and Databinding Draw2D -> Angular
      function changeCallback(emitter, attribute) {
        $timeout(function () {
          if (scope.editor.selection.attr !== null) {
            scope.editor.selection.attr[attribute] = emitter.attr(attribute);
          }
        }, 0);
      }

      function changeCodeCallback() {
        var node = scope.editor.selection.figure;
        if (!node) {
          return;
        }
        var codeEditor = scope.editor.ace.getValue();
        var diffMatch = node.codeInit.localeCompare(codeEditor) !== 0;
        $timeout(function () {
          scope.editor.hasCodeChanges = diffMatch;
        }, 0);
      }

      function cleanEditorSelection() {
        scope.editor.saveCode();
        if (scope.editor.selection.figure) {
          scope.editor.selection.figure.codeInit = '';
        }
        scope.editor.selection.className = null;
        scope.editor.selection.attr = null;
        scope.editor.ace.setValue('');
        scope.editor.ace.getSession().setUndoManager(new ace.UndoManager());
        scope.editor.hasCodeChanges = false;
        //disable ace editor
        scope.editor.ace.setOptions({
          readOnly: true,
          highlightActiveLine: false,
          highlightGutterLine: false
        });
        scope.editor.ace.renderer.$cursorLayer.element.style.opacity = 0;
      }

      function showNodeCode(node) {
        let nodeId = node.userData.nodeId;
        if (_.isUndefined(nodeId)) {
          scope.editor.ace.setValue('');
          return;
        }
        //retrieve node code from server
        $http.get('/api/nodes/' + nodeId)
          .then(response => {
            //display code in code editor
            node.codeInit = response.data.code;
            scope.editor.ace.setValue(response.data.code);
            scope.editor.ace.getSession().setUndoManager(new ace.UndoManager());

            //enable ace editor
            scope.editor.ace.setOptions({
              readOnly: false,
              highlightActiveLine: true,
              highlightGutterLine: true
            });
            scope.editor.ace.renderer.$cursorLayer.element.style.opacity = 1;
          });
      }

      canvas.on('select', function (canvasSelected, target) {
        var figure = target.figure;
        $timeout(function () {
          if (figure) {
            if (figure.userData.isSystem) {
              cleanEditorSelection();
            } else {
              scope.editor.selection.className = figure.NAME;
              scope.editor.selection.attr = figure.attr();
            }
            var type = figure.NAME.split('.');
            switch (type[2]) {
              case 'node':
                showNodeCode(figure);
                break;
            }
          } else {
            cleanEditorSelection();
          }

          // unregister and register the attr listener to the new figure
          //
          if (scope.editor.selection.figure) {
            scope.editor.selection.figure.off('change', changeCallback);
            scope.editor.ace.off('change', changeCodeCallback);
          }
          if (figure && !figure.userData.isSystem) {
            scope.editor.selection.figure = figure;
          } else {
            scope.editor.selection.figure = null;
          }
          if (scope.editor.selection.figure) {
            scope.editor.selection.figure.on('change', changeCallback);
            scope.editor.ace.on('change', changeCodeCallback);
          }
        }, 0);
      });

      // Databinding: Angular UI -> Draw2D
      // it is neccessary to call the related setter of the draw2d object. 'Normal' Angular
      // Databinding didn't work for draw2d yet
      //
      scope.$watchCollection('editor.selection.attr', function (newValues, oldValues) {

        if (oldValues !== null && scope.editor.selection.figure !== null) {
          // for performance reason we post only changed attributes to the draw2d figure
          //
          var changes = draw2d.util.JSON.diff(newValues, oldValues);
          scope.editor.selection.figure.attr(changes);
        }
      });

      // push the canvas function to the scope for ng-action access
      //
      scope.editor.undo = $.proxy(stack.undo, stack);
      scope.editor.redo = $.proxy(stack.redo, stack);
      scope.editor.delete = $.proxy(function() {
        let figure = scope.editor.selection.figure;
        let command = new draw2d.command.CommandDelete(figure);
        this.getCommandStack().execute(command);
        $http.delete('/api/nodes/' + figure.userData.nodeId);
      }, canvas);
      scope.editor.load = $.proxy((json) => {
        canvas.clear();
        let reader = new draw2d.io.json.Reader();
        reader.unmarshal(canvas, json);
      }, canvas);
      scope.editor.saveCode = () => {
        let node = scope.editor.selection.figure;
        if (!node) {
          return;
        }
        let nodeId = node.userData.nodeId;
        if (_.isUndefined(nodeId)) {
          return;
        }
        //save code from editor
        var codeEditor = scope.editor.ace.getValue();
        $http.put('/api/nodes/' + nodeId, { code: codeEditor })
          .then(response => {
            //reset codeInit
            node.codeInit = response.data.code;
            scope.editor.hasCodeChanges = false;
          });
      };

      scope.editor.runCode = () => {
        $http.get('/api/services/' + service._id + '/eval')
          .then(response => {
            //code run response
            console.log(response);
          });
      };
    }
  };
});

