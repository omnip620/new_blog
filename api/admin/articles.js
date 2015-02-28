/**
 * Created by panew on 14-12-23.
 */
var Article = require('../../models/article');
var TagMap = require('../../models/tagmap');
var Tag = require('../../models/tag');
var async = require('async');
var Promise = require('bluebird');
var _ = require('lodash');
var cat = require('../../config').cat;

exports.index = function (req, res) {
  console.log(111);
  Article.find({}, 'title source top created_at updated_at views cat comment_ids').exec()
    .then(function (articles) {
      return Promise.map(articles, function (article) {
        return new Promise(function (resolve, reject) {
          article.getTags(function (err, tags) {
            if (err) {
              reject(err);
            }
            article._doc.tags = tags;
            resolve(article);
          });
        });
      })
    })
    .then(function (articles) {
      return res.json(200, articles);
    })
    .then(null, function (err) {
      return handleError(res, err);
    })
};

exports.create = function (req, res) {
  Article.create(req.body, function (err, article) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, article);
  });
};

exports.update = function (req, res) {
  var id;
  if (req.body._id) {
    id = req.body._id;
    delete req.body._id;
  }
  req.body.updated_at = new Date();
  Article.update({_id: id}, req.body, function (err, article) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200);
  });
};

exports.show = function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) {
      return handleError(res, err);
    }

    return res.json(200, article);
  });
};

exports.generate = function (req, res) {
  var num = req.params.num;
  var obj = {title: '', top: '', views: ''};
  console.log(num);
  for (var i = 0; i < num; i++) {
    obj.title = Math.random().toString(16).substring(2);
    obj.top = (function () {
      if (Math.random() * 10 > 5) {
        obj.cat = 1;
        return 'true';
      }
      obj.cat = 2;
      return 'false';
    })();
    obj.views = Math.round(Math.random() * 1000);
    Article.create(obj, function (err, article) {
      if (err) {
        console.log(err);
      }
    });
  }
  return res.send(201);
};
exports.cats = function (req, res) {
  return res.json(200, cat);
};
exports.destroy = function (req, res) {
  var ids = req.body;
  Article.remove({_id: {$in: ids}}).exec()
    .then(function () {
      return res.send(204);
    })
    .then(null, function (err) {
      return handleError(res, err)
    })
};
function handleError(res, err) {
  return res.send(500, err);
}