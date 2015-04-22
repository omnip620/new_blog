/**
 * Created by panew on 15-3-17.
 */
var Article = require('./../models/article');
var Tag = require('./../models/tag');

module.exports = function (req, res, next) {
   Promise.
    join(
    Article.find({}, 'title views', {sort: '-views', limit: 5}).exec(),
    Tag.find({}).exec(),
    Article.find({}, 'title comment_ids', {limit: 5, sort: '-comment_ids'}).exec(),
    function (topviews, taglist, topcomments) {
      res.locals.topViews = topviews;
      res.locals.tagList = taglist;
      res.locals.topComments = topcomments;
      next();
    })
    .catch(function (err) {
      return res.redirect('/404')
    })
};