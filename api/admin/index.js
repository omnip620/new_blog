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

router.get('/articles/generate/:num', articles.generate);

router.route('/articles/:id?')
  .get(articles.show)
  .post(articles.create)
  .put(articles.update)
  .delete(articles.destroy);

router.route('/tags')
  .post(tags.create)
  .get(tags.index)
  .delete(tags.destroy);

router.get('/tags/get', tags.get);
module.exports = router;
