/**
 * Created by panew on 15-2-4.
 */
var Tag = require('../../models/tag');
var Promise = require('bluebird');
var Article = require('../../models/article');
var _ = require('lodash');

exports.index = function (req, res) {
  Tag.find().lean().exec()
    .then(function (tags) {
      Promise.map(tags, function (tag) {
        return Article.find({"tags": tag.name}).lean().exec()
          .then(function (articles) {
            tag.count = articles.length;
            return tag
          })
      })
        .then(function (result) {
          return res.status(200).json(result);
        })
    })
};

exports.get = function (req, res) {
  var word = new RegExp(req.query.word, 'g');
  Tag.find({name: word}, function (err, tags) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(tags);
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
      return res.status(200).json(tags);
    });
  })
};

exports.update = function (req, res) {
  var id;
  if (req.body._id) {
    id = req.body._id;
    delete req.body._id;
  }
  Tag.update({_id: id}, req.body, function (err, tag) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200);
  });
};

exports.destroy = function (req, res) {
  var ids = req.body.ids || req.body;
  Tag.find({_id: {$in: ids}})
    .then(function (tags) {
      Tag.remove({_id: {$in: ids}}).exec();
      return Promise.map(tags, function (tag) {
        return Article.update({tags: tag.name}, {$pull: {tags: tag.name}}, {multi: true}).exec()
      })
    })
    .then(function (docs) {
      return res.status(204).send();
    })
    .then(null, function (err) {
      console.log(err);
      return res.status(500).send(err)
    });

};

function handleError(res, err) {
  return res.status(500).send(err)
}