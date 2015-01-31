/**
 * Created by panew on 14-12-23.
 */
var Article = require('../../models/article');
var async = require('async');
var Promise = require('bluebird');
var _=require('lodash');
var cat=require('../../config').cat;

exports.index = function (req, res) {
  Article.find({}, 'title top source tags views comments updated_at created_at ', function (err, articles) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, articles);
  });
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
  console.log(req.body)
  req.body.updated_at=new Date();
  Article.update({_id:id},req.body,function(err,article,raw){
    if(err){
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
        return 'true';
      }
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
exports.cats=function(req,res){
  return res.json(200,cat);
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
      return res.send(204);
    })
    .catch(function (err) {
      return res.send(500, err);
    });
};
function handleError(res, err) {
  return res.send(500, err);
}