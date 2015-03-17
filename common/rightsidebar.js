/**
 * Created by panew on 15-3-17.
 */
var Article = require('./../models/article');
var Tag = require('./../models/tag');

module.exports = function (req, res, next) {

  Article.find({}, 'title views', {sort: '-views', limit: 5}).exec()
    .then(function (result) {
      res.locals.topViews = result;
      return Tag.find({}).exec();
    })
    .then(function (result) {
      res.locals.tagList = result;
      return Article.find({}, 'title comment_ids', {limit: 5, sort: '-comment_ids'}).exec();
    })
    .then(function (result) {
      res.locals.topComments = result;
      next();
    })
    .then(null, function (err) {
      return res.redirect('/404')
    })
}