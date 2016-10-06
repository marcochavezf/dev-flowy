/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/services/:id/test     ->  eval get endpoint
 */

'use strict';

import _ from 'lodash';
import vm from 'vm';
import Service from './service.model';
import Node from '../node/node.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function buildNodeFlow(res){
  return function(entity) {
    let nodeStart = null, nodeEnd = null;
    let nodesBetween = [];
    let connections = [];

    //get nodes and connections
    _.each(entity.draw2dContent, function(d2Entity){
      switch (d2Entity.type){
        case 'draw2d.shape.node.Start':
          nodeStart = d2Entity;
          break;

        case 'draw2d.shape.node.End':
          nodeEnd = d2Entity;
          break;

        case 'draw2d.shape.node.Between':
          nodesBetween.push(d2Entity);
          break;

        case 'draw2d.Connection':
          connections.push(d2Entity);
          break;
      }
    });

    if (_.isNil(nodeStart) || _.isNil(nodeEnd) || _.isEmpty(nodesBetween) || _.isEmpty(connections)){
      let statusCode = 500;
      let err = new Error('flow is not well formatted');
      return res.status(statusCode).send(err);
    }

    //build ordered node flow
    let nodeFlow = [nodeStart];
    while (!_.isEmpty(connections)){
      let sourceNode = _.last(nodeFlow);
      let connectionBtwn = _.find(connections, function(connection){
        return sourceNode.id === connection.source.node;
      });
      let targetNode = _.find(nodesBetween, function(node){
        return node.id === connectionBtwn.target.node;
      });

      _.remove(connections, function(connection){ return connection === connectionBtwn; });
      if(_.isNil(targetNode) && nodeEnd.id === connectionBtwn.target.node){
        nodeFlow.push(nodeEnd);
      } else {
        nodeFlow.push(targetNode);
      }
    }

    return nodeFlow;
  };
}

function getNodeFlowCode(res) {
  return function(nodeFlow) {
    var d2Ids = _.map(nodeFlow, (d2Entity) => { return d2Entity.id });
    return Node.find()
      .where('draw2dId')
      .in(d2Ids)
      .exec()
      .then(function(res){
        return { nodeFlowDiagram: nodeFlow, nodeFlowCode: res };
      })
  };
}

function evalNodeFlowCode(res, statusCode){
  statusCode = statusCode || 200;
  return function(params) {
    let nodeFlowCode = params.nodeFlowCode;
    let vmResults = [];
    _.each(nodeFlowCode, function(node, key){
      let vmResult, fnEval;
      let codeToExec = 'var fnEval = ' + node.code + ';';
      console.log(codeToExec);
      //let codeToExec = '(' + node.code + ')(\'asdkfhj\',21234);';

      try {
        let script = new vm.Script(codeToExec, { displayErrors: true });
        vmResult = {
          result: script.runInThisContext()
        };
        fnEval(12,12);
        console.log('fnEval:' + fnEval);
        console.log('vmResult:' + vmResult);
      } catch (e) {
        vmResult = {
          result: e.toString(),
          error: e
        };
      }

      vmResults.push(vmResult);
      console.log(vmResults);
    });
    res.status(statusCode).json(vmResults);
  };
}

// Gets a single Service from the DB
export function evalGet(req, res) {
  return Service.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(buildNodeFlow(res))
    .then(getNodeFlowCode(res))
    .then(evalNodeFlowCode(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
