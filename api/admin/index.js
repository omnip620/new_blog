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
router.post('/articles/delete', articles.destroy);
router.get('/articles/generate/:num', articles.generate);

router.route('/articles/:id')
  .post(articles.create)
  .put(articles.update)
  .get(articles.show);

router.route('/tags')
  .get(tags.index)
  .delete(tags.destroy);

router.post('/tags', tags.create);
router.get('/tags/get', tags.get);


module.exports = router;
