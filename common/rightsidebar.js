/**
 * Created by panew on 15-3-17.
 */

var co = require('co');
var Article = require('./../models/article');
var Tag = require('./../models/tag');
var cache = require('../service/cache');

module.exports = function (req, res, next) {
  cache.get('sideBarData',function(err,data){
    if(data){
      Object.assign(res.locals, data);
      return next();
    }
    co(function *(){
      var sideBar= yield {
        topViews: Article.find({}, 'title views', {sort: '-views', limit: 5}).exec(),
        tagList: Tag.find({}).exec(),
        topComments:Article.find({}, 'title comment_ids', {limit: 5, sort: '-comment_ids'}).exec()};
      cache.set('sideBarData', sideBar, 1800);
      Object.assign(res.locals, sideBar);
      return next();
    });
  });
};