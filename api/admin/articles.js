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
  var articles = null;
  Article.find({}, 'title top source views comments updated_at created_at ').exec()
    .then(function (results) {
      articles = results;
    })
    .then(function () {
      return TagMap.find({}).exec();
    })
    .then(function (tagmap) {
      var promiseFind = function (item) {
        return new Promise(function (resolve, reject) {
          Tag.find({_id: item.tag_id}, function (err, result) {
            if (err) {
              reject(err);
            } else {
              var o = {
                article_id: item.article_id,
                tag_name: result[0].name
              }
              resolve(o);
            }
          });
        });
      }
      return Promise.map(tagmap, function (fileName) {
        return promiseFind(fileName);
      })
    })
    .then(function (parsedJSONs) {
      parsedJSONs.forEach(function (o) {
        articles.forEach(function (article) {
          article._doc.tags = article._doc.tags || [];
          if (article._id == o.article_id) {
            article._doc.tags.push(o.tag_name)
          }
        });
      });
      return res.json(200, articles);
    })
    .then(null, function (err) {
      console.log(err)
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
  var remove = function (id) {
    return new Promise(function (resolve, reject) {
      Article.remove({_id: id}, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
  Promise
    .map(ids, function (id) {
      return remove(id);
    })
    .then(function (results) {
      console.log(results);
      return res.send(204);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
};
function handleError(res, err) {
  return res.send(500, err);
}