/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/services              ->  index
 * POST    /api/services              ->  create
 * GET     /api/services/:id          ->  show
 * PUT     /api/services/:id          ->  update
 * DELETE  /api/services/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Service from './service.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  delete updates.__v;
  delete updates.__id;
  return function(entity) {
    //empty original draw2dContent
    entity.draw2dContent = [];
    var updated = _.merge(entity, updates);
    updated.markModified('draw2dContent');
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
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

// Gets a list of Services
export function index(req, res) {
  return Service.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Service from the DB
export function show(req, res) {
  return Service.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Service in the DB
export function create(req, res) {
  return Service.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Service in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Service.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Service from the DB
export function destroy(req, res) {
  return Service.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
