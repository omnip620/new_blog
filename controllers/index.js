/**
 * Created by panew on 14-12-5.
 *
 * GET home page. */

var Article = require('../models/article');
var _ = require('lodash');
var moment = require('moment');

exports.show = function (req, res) {
  Article.find({}, '_id title top source tags views comments updated_at created_at content',{'sort':'-updated_at',limit:10},function (err, articles) {
    if (err) {
      return res.redirect('/404')
    }
    articles.forEach(function(o){
      if (o.content) {
        o.content = o.content.substring(0, 170) + '...';
      }
    });
    return res.render('index', {articles: articles});
  });
};

exports.page=function(req,res){
  var pageNum=parseInt(req.query.num,10);
  console.log(pageNum);
  Article.find({}, '_id title top source tags views comments updated_at created_at content',{'sort':'-updated_at',skip:(pageNum-1)*10,limit:10},function (err, articles) {
    if (err) {
      return res.json('404',err)
    }
    articles.forEach(function(o){
      if (o.content) {
        o.content = o.content.substring(0, 170) + '...';
      }
    });
    return res.json(articles);
  });
};