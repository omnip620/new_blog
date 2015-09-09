/**
 * Created by panew on 15-3-17.
 */

var Promise = require('bluebird');
var _ = require('lodash');
var Article = require('./../models/article');
var Tag = require('./../models/tag');
var cache = require('../service/cache');

module.exports = function (req, res, next) {
  var cacheGetAsync = Promise.promisify(cache.get);

  cacheGetAsync('sideBarData')
    .then(function (data) {
      if (data) {
        return data;
      }
      return Promise.
        all([
          Article.find({}, 'title views', {sort: '-views', limit: 5}).exec(),
          Tag.find({}).exec(),
          Article.find({}, 'title comment_ids', {limit: 5, sort: '-comment_ids'}).exec()])
        .spread(function (topviews, taglist, topcomments) {
          var sideBarData = {};
          sideBarData.topViews = topviews;
          sideBarData.tagList = taglist;
          sideBarData.topComments = topcomments;
          cache.set('sideBarData', sideBarData, 1800);
          return sideBarData;
        })
    })
    .then(function (data) {
      _.extend(res.locals, data);
      return next()
    });
};