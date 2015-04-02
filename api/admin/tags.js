/**
 * Created by panew on 15-2-4.
 */
var Tag = require('../../models/tag');
var TagMap = require('../../models/tagmap');
var Article = require('../../models/article');
var Promise = require('bluebird');
var _ = require('lodash');


exports.index = function (req, res) {
  Tag.find({}).exec()
    .then(function (tags) {
      Promise.map(tags, function (tag) {
        return Article.find({"tag_ids": tag._id}).exec()
          .then(function (articles) {
            tag._doc.count = articles.length;
            return tag
          })
      })
        .then(function (result) {
          return res.json(200, result);
        })
    })
};

exports.get = function (req, res) {
  var word = new RegExp(req.query.word, 'g');
  Tag.find({name: word}, function (err, tags) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, tags);
  });
};

exports.getatag = function (req, res) {
  var id = req.query.id;
  TagMap.find({article_id: id}).exec()
    .then(function (result) {
      if (!result.length) {
        return res.json(200, []);
      }
      var ids = result.map(function (item) {
        return item.tag_id;
      });
      return new Promise.resolve(ids);
    })
    .then(function (ids) {
      return Tag.find({_id: {$in: ids}}).exec();
    })
    .then(function (atags) {
      return res.json(200, atags);
    })
    .then(null, function (err) {
      return handleError(res, err);
    })
};

exports.save = function (req, res) {
  var items = req.body;
  TagMap.remove({article_id: items.id}).exec()
    .then(function () {
      if (!items.tags.length) {
        return res.json(200, 'deleted');
      }
      items.tags = items.tags.map(function (item) {
        return {article_id: items.id, tag_id: item}
      });
      TagMap.collection.insert(items.tags, function (err, tags) {
        if (err) {
          return Promise.reject(err);
        }
        return Promise.resolve(tags)
      })
    }).then(function (tags) {
      return res.json(200, tags);
    }).then(null, function (err) {
      return handleError(res, err);
    });
};

exports.create = function (req, res) {
  Tag.create(req.body, function (err, tag) {
    if (err) {
      return handleError(res, err);
    }
    Tag.find({}, function (err, tags) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, tags);
    });
  })
};

exports.update = function (req, res) {
  var id;
  if (req.body._id) {
    id = req.body._id;
    delete req.body._id;
  }
  req.body.updated_at = new Date();
  Tag.update({_id: id}, req.body, function (err, tag) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200);
  });
};

exports.destroy = function (req, res) {
  var ids = req.body;
  Tag.remove({_id: {$in: ids}}).exec()
    .then(function () {
      return TagMap.remove({tag_id: {$in: ids}}).exec()
    })
    .then(function () {
      return res.send(204);
    })
    .then(null, function (e) {
      return res.send(500, err);
    });

};

function handleError(res, err) {
  return res.send(500, err);
}