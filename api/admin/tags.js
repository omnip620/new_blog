/**
 * Created by panew on 15-2-4.
 */
var Tag = require('../../models/tag');
var TagMap = require('../../models/tagmap');
var Promise = require('bluebird');
var _ = require('lodash');

exports.index = function (req, res) {
  var tags = null;
  Tag.find({}).exec()
    .then(function (result) {
      tags = result;
      return TagMap.aggregate([{$group: {"_id": "$tag_id", count: {$sum: 1}}}]).exec();
    })
    .then(function (tms) {
      tags.forEach(function (tag) {
        tag._doc.count = tag._doc.count || '';
        tms.forEach(function (tm) {
          if (tag._id == tm._id) {
            tag._doc.count = tm.count;
          }
        })
      });
      return res.json(200, tags);
    })
    .then(null, function (err) {
      console.log(err)
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
        return res.json(200, 'eleted');
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