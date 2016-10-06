'use strict';

var app = require('../..');
import request from 'supertest';

var newNode;

describe('Node API:', function() {

  describe('GET /api/nodes', function() {
    var nodes;

    beforeEach(function(done) {
      request(app)
        .get('/api/nodes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          nodes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(nodes).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/nodes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/nodes')
        .send({
          name: 'New Node',
          info: 'This is the brand new node!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newNode = res.body;
          done();
        });
    });

    it('should respond with the newly created node', function() {
      expect(newNode.name).to.equal('New Node');
      expect(newNode.info).to.equal('This is the brand new node!!!');
    });

  });

  describe('GET /api/nodes/:id', function() {
    var node;

    beforeEach(function(done) {
      request(app)
        .get('/api/nodes/' + newNode._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          node = res.body;
          done();
        });
    });

    afterEach(function() {
      node = {};
    });

    it('should respond with the requested node', function() {
      expect(node.name).to.equal('New Node');
      expect(node.info).to.equal('This is the brand new node!!!');
    });

  });

  describe('PUT /api/nodes/:id', function() {
    var updatedNode;

    beforeEach(function(done) {
      request(app)
        .put('/api/nodes/' + newNode._id)
        .send({
          name: 'Updated Node',
          info: 'This is the updated node!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedNode = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedNode = {};
    });

    it('should respond with the updated node', function() {
      expect(updatedNode.name).to.equal('Updated Node');
      expect(updatedNode.info).to.equal('This is the updated node!!!');
    });

  });

  describe('DELETE /api/nodes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/nodes/' + newNode._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when node does not exist', function(done) {
      request(app)
        .delete('/api/nodes/' + newNode._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
