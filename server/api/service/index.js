'use strict';

var express = require('express');
var controller = require('./service.controller');
var evalController = require('./service.eval.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

//eval
router.get('/:id/eval', evalController.evalGet);
/*
router.post('/:id/test', evalController.create);
router.put('/:id/test', evalController.update);
router.patch('/:id/test', evalController.update);
router.delete('/:id/test', evalController.destroy);
*/
module.exports = router;
