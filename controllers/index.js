/**
 * Created by panew on 14-12-5.
 *
 * GET home page. */

var Article = require('../models/article');
var _ = require('lodash');
var moment = require('moment');
var md = require('markdown-it')({html: true, linkify: true, typographer: true});

function page(cat, num, callback) {
  var query = {};
  if(cat){
    query.cat=cat;
  }
  Article.find(query, '_id cat title top source tags views comments updated_at created_at content', {
    sort: '-updated_at',
    skip: (num - 1) * 10,
    limit: 10
  }, function (err, articles) {
    if (err) {
      return callback(err)
    }
    articles.forEach(function (o) {
      if (o.content) {
        o.content = md.render(o.content.substring(0, 170)).replace(/<[^>]+>/gi, '') + '...';
      }
    });
    callback(null, articles)
  });
}

exports.show = function (req, res) {
  var cat = req.query.cat;
  page(cat, 1, function (err, articles) {
    if (err) {
      return res.redirect('/404')
    }
    return res.render('index', {articles: articles});
  })

};

exports.page = function (req, res) {
  var pageNum = parseInt(req.query.num, 10);
  var cat = parseInt(req.query.cat, 10);
  page(cat, pageNum, function (err, articles) {
    if (err) {
      return res.json('404', err)
    }
    return res.json(articles);
  })
};