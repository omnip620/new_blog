/**
 * Created by panew on 15-3-17.
 */
var Article = require('./../models/article');
var Tag = require('./../models/tag');
var Promise = require('bluebird');
var cache = require('../service/cache');

module.exports = function (req, res, next) {
  var cacheGetAsync = Promise.promisify(cache.get);

  Promise.
    join(cacheGetAsync('topviews'),
    cacheGetAsync('taglist'),
    cacheGetAsync('topcomments'), function (topviews, taglist, topcomments) {
      if (topviews && taglist && topcomments) {
        res.locals.topViews = topviews;
        res.locals.tagList = taglist;
        res.locals.topComments = topcomments;
        return next();
      }
      Promise.
        join(
        Article.find({}, 'title views', {sort: '-views', limit: 5}).exec(),
        Tag.find({}).exec(),
        Article.find({}, 'title comment_ids', {limit: 5, sort: '-comment_ids'}).exec(),
        function (topviews, taglist, topcomments) {
          res.locals.topViews = topviews;
          res.locals.tagList = taglist;
          res.locals.topComments = topcomments;          cache.set('topviews', topviews, 1800);
          cache.set('taglist', taglist, 1800);
          cache.set('topcomments', topcomments, 1800);
          return next();
        })
        .catch(function (err) {
          return res.redirect('/404')
        })
    });
};