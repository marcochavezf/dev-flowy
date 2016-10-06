'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var nodeCtrlStub = {
  index: 'nodeCtrl.index',
  show: 'nodeCtrl.show',
  create: 'nodeCtrl.create',
  update: 'nodeCtrl.update',
  destroy: 'nodeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var nodeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './node.controller': nodeCtrlStub
});

describe('Node API Router:', function() {

  it('should return an express router instance', function() {
    expect(nodeIndex).to.equal(routerStub);
  });

  describe('GET /api/nodes', function() {

    it('should route to node.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'nodeCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/nodes/:id', function() {

    it('should route to node.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'nodeCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/nodes', function() {

    it('should route to node.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'nodeCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/nodes/:id', function() {

    it('should route to node.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'nodeCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/nodes/:id', function() {

    it('should route to node.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'nodeCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/nodes/:id', function() {

    it('should route to node.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'nodeCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
