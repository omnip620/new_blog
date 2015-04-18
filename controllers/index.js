/**
 * Created by panew on 14-12-5.
 *
 * GET home page. */

var Article = require('../models/article');
var Tag = require('../models/tag');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');

function page(query, num, callback) {
  if (query.tagName) {
    query = {tags: query.tagName}
  }
  Article.find(query, '', {
    sort : '-created_at',
    skip : (num - 1) * 10,
    limit: 10
  }).exec()
    .then(function (articles) {
      callback(null, articles)
    })
    .then(null, function (err) {
      callback(err);
    });
}


exports.show = function (req, res) {
  var query = {};
  if (req.query.cat) {
    query.cat = req.query.cat;
  }
  page(query, 1, function (err, articles) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.render('index', {articles: articles});
  })
};

exports.page = function (req, res) {
  var pageNum = parseInt(req.query.num, 10), query = {};
  if (req.query.cat) {
    query.cat = parseInt(req.query.cat, 10)
  }
  if (req.query.tag) {
    query.tag = req.query.tag;
  }
  page(query, pageNum, function (err, articles) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(articles);
  })
};

exports.tags = function (req, res) {
  var query = {tagName: decodeURI(req.params.name)};
  page(query, 1, function (err, articles) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.render('index', {articles: articles});
  })
};

exports.archive = function (req, res) {
  Article.find({}, 'title updated_at created_at comment_ids', {sort: '-created_at'}).exec()
    .then(function (articles) {
      articles = _.groupBy(articles, function (item) {
        return JSON.stringify(item.created_at).substring(1, 8)
      });
      return res.render('archive', {articles: articles});
    })
    .then(null, function (err) {
      return res.status(500).json(err);
    })
};

exports.login = function (req, res) {
  return res.render('login', {layout: false});
};

exports.loginto = function (req, res) {
  var username = req.body.username, pwd = req.body.pwd,
      encryp = '$2a$10$T3yQKKGF/RW2OQ1rtAl9w.BD9ggsaMZ8q6kNcOZ0FaPYt6gw8dlHa';
  if (bcrypt.compareSync(username + pwd, encryp)) {
    req.session.user = username;
    res.redirect('/admin/');
  }
};

exports.friendlinks = function (req, res) {
  return res.render('friendlinks');
};
exports.about = function (req, res) {
  return res.render('about', {layout: false});
};

exports.admin = function (req, res) {
  var cats = [
    {name: "设置", url: "/admin/"},
    {name: "文章", url: "/admin/articles/"},
    {name: "标签", url: "/admin/tags/"}
  ];
  return res.render('admin/index', {
    layout     : false,
    categeories: cats
  });
};