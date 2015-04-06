/**
 * Created by panew on 14-12-23.
 */
'use strict';

var express = require('express');
var articles = require('./articles.js');
var tags = require('./tags.js');

var router = express.Router();

router.get('/articles', articles.index);
router.get('/articles/cat', articles.cats);
router.get('/articles/:id', articles.show);
router.post('/articles', articles.create);
router.post('/articles/delete', articles.destroy);
router.post('/articles/update', articles.update);
router.get('/articles/generate/:num', articles.generate);

router.post('/tags', tags.create);
router.post('/tags/delete', tags.destroy);
router.get('/tags', tags.index);
router.get('/tags/get', tags.get);


module.exports = router;
