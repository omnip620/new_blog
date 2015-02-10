/**
 * Created by panew on 15-2-4.
 */
var Tag = require('../../models/tag');
var TagMap = require('../../models/tagmap');
var Promise = require('bluebird');
var _ = require('lodash');
var mongoose = require('mongoose');

exports.index = function (req, res) {
  Tag.find({}, function (err, tags) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, tags);
  });
  //Tag.find({}).exec().then(function (tags) {
  //  console.log(tags);
  //  var ids = tags.map(function (t) {
  //    return t._id;
  //  });
  //  return TagMap.find({tag_id: {$in: ids}}).exec();
  //}).then(function (tm) {
  //  console.log(tm);
  //  return res.json(200);
  //}).then(null, function (err) {
  //  return handleError(res, err);
  //})
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
      var ids = result.map(function (item) {
        return item.tag_id;
      });
      return new Promise(function (resolve, reject) {
        if (ids.length) {
          return resolve(ids);
        }
        return reject('article has not tags id');
      })
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
  var items = req.body, query = [];
  items.tags.forEach(function (item) {
    query.push({article_id: items.id, tag_id: item});
  });
  TagMap.find({article_id: items.id}).exec()
    .then(function () {
      return TagMap.remove({article_id: items.id}).exec();
    }).then(function () {
      return new Promise(function (resolve, reject) {
        if (!query.length) {
          return resolve()
        }
        TagMap.collection.insert(query, function (err, tags) {
          if (err) {
            return reject(err);
          }
          return resolve(tags)
        })
      });
      //var promise = new mongoose.Promise;
      //TagMap.collection.insert(query, function (err, tags) {
      //  if (err) {
      //    return promise.reject(err);
      //  }
      //  return promise.resolve(tags);
      //})
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
  var remove = function (id) {
    return new Promise(function (resolve, reject) {
      Tag.remove({_id: id}, function (err) {
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
      return res.send(204);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}