'use strict';

var app = require('../..');
import request from 'supertest';

var newService;

describe('Service API:', function() {

  describe('GET /api/services', function() {
    var services;

    beforeEach(function(done) {
      request(app)
        .get('/api/services')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          services = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(services).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/services', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/services')
        .send({
          name: 'New Service',
          info: 'This is the brand new service!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newService = res.body;
          done();
        });
    });

    it('should respond with the newly created service', function() {
      expect(newService.name).to.equal('New Service');
      expect(newService.info).to.equal('This is the brand new service!!!');
    });

  });

  describe('GET /api/services/:id', function() {
    var service;

    beforeEach(function(done) {
      request(app)
        .get('/api/services/' + newService._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          service = res.body;
          done();
        });
    });

    afterEach(function() {
      service = {};
    });

    it('should respond with the requested service', function() {
      expect(service.name).to.equal('New Service');
      expect(service.info).to.equal('This is the brand new service!!!');
    });

  });

  describe('PUT /api/services/:id', function() {
    var updatedService;

    beforeEach(function(done) {
      request(app)
        .put('/api/services/' + newService._id)
        .send({
          name: 'Updated Service',
          info: 'This is the updated service!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedService = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedService = {};
    });

    it('should respond with the updated service', function() {
      expect(updatedService.name).to.equal('Updated Service');
      expect(updatedService.info).to.equal('This is the updated service!!!');
    });

  });

  describe('DELETE /api/services/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/services/' + newService._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when service does not exist', function(done) {
      request(app)
        .delete('/api/services/' + newService._id)
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
