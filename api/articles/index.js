/**
 * Created by panew on 14-12-23.
 */
'use strict';

var express = require('express');
var controller = require('./articles.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/cat',controller.cats);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/delete', controller.destroy);
router.post('/update', controller.update);
router.get('/generate/:num', controller.generate);

module.exports = router;