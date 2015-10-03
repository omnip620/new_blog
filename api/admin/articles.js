/**
 * Created by panew on 14-12-23.
 */
var Article = require('../../models/article');
var Promise = require('bluebird');
var _ = require('lodash');
var cat = require('../../config').cat;
var Tags = require('../../models/tag');

exports.index = function (req, res) {
  Article.find({}, 'title source tags top created_at updated_at views cat comment_ids', function (err, articles) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(articles)
  })

};

exports.create = function (req, res) {
  Article.create(req.body, function (err, article) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(article);
  });
};

exports.update = function (req, res) {
  var body = req.body;
  body.updated_at = new Date();
  var tags = body.tags.split(',');
  Tags
    .find({name: {$in: tags}})
    .then(function (a) {
      a = _(a)
        .pluck('name')
        .xor(tags)
        .compact()
        .map(function (name) {
          return {name: name}
        })
        .value();
      return a.length ? Tags.create(a) : null;
    })
    .then()
    .catch(function (err) {
      console.log(err)
    });
  body.tags = tags;
  Article.update({_id: req.params.id}, body, function (err, article) {
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
    return res.status(200).json(article);
  });
};

exports.generate = function (req, res) {
  var num = req.params.num;
  var obj = {title: '', top: '', views: ''};
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
    Article.create(obj, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  return res.send(201);
};
exports.cats = function (req, res) {
  return res.status(200).json(cat);
};
exports.destroy = function (req, res) {
  var ids = req.body;
  Article.remove({_id: {$in: ids}}, function (err) {
    if (err) {
      return handleError(res, err);
    }
    return res.send(204);
  });
};
function handleError(res, err) {
  return res.send(500, err);
}