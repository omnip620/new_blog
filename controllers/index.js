/**
 * Created by panew on 14-12-5.
 *
 * GET home page. */

var Article = require('../models/article');
var Tag = require('../models/tag');
var TagMap = require('../models/tagmap');
var _ = require('lodash');
var moment = require('moment');
var md = require('markdown-it')({html: true, linkify: true, typographer: true});
var Promise = require('bluebird');
var bcrypt = require('bcrypt');


function formatArticles(articles, callback) {
  Promise.map(articles, function (article) {
    return new Promise(function (resolve, reject) {
      article.getTags(function (err, tags) {
        if (err) {
          reject(err);
        }
        article.tags = tags;
        resolve(article);
      });
      if (article.content) {
        article.content = md.render(article.content.substring(0, 170)).replace(/<[^>]+>/gi, '') + '...';
      }
    })
  }).then(function () {
    callback(null, articles)
  })
}

function page(query, num, callback) {
  if (query.tag) {
    var articleIds = '';
    TagMap.find({tag_id: query.tag}).exec()
      .then(function (results) {
        articleIds = results.map(function (item) {
          return item.article_id;
        });
        return Article.find({_id: {$in: articleIds}}, '', {
            sort: '-updated_at',
            skip: (num - 1) * 10,
            limit: 10
          }
        ).exec()
      })
      .then(function (articles) {
        formatArticles(articles, callback);
      });
    return;
  }
  Article.find(query, '', {
    sort: '-updated_at',
    skip: (num - 1) * 10,
    limit: 10
  }, function (err, articles) {
    if (err) {
      return callback(err)
    }
    formatArticles(articles, callback);
  });
}


exports.show = function (req, res) {

  var query = {};
  if (req.query.cat) {
    query.cat = req.query.cat;
  }
  page(query, 1, function (err, articles) {
    if (err) {
      return res.redirect('/404')
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
      return res.json('404', err)
    }

    return res.json(articles);
  })
};

exports.tags = function (req, res) {
  var id = req.params.id;
  page({tag: id}, 1, function (err, articles) {
    if (err) {
      return res.json('404', err)
    }
    return res.render('index', {articles: articles});
  })
};

exports.archive = function (req, res) {
  Article.find({}, 'title updated_at created_at comment_ids', {sort: '-updated_at'}).exec()
    .then(function (articles) {
      var groupedByMonth =
        _.groupBy(articles, function (item) {
          return JSON.stringify(item._doc.updated_at).substring(1, 8)
        });
      groupedByMonth = _.map(groupedByMonth, function (item, i) {
        return {
          date: i,
          item: item
        }
      });
      return res.render('archive', {articles: groupedByMonth});
    })
    .then(null, function () {
      return res.redirect('/404')
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

exports.admin = function (req, res) {
  var cats = [
    {name: "设置", url: "/admin/"},
    {name: "文章", url: "/admin/articles/"},
    {name: "标签", url: "/admin/tags/"}
  ];
  return res.render('admin/index', {
    layout: false,
    categeories: cats
  });
};