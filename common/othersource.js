/**
 * Created by panew on 15-2-24.
 */

var http = require('http');
var Article = require('./../models/article');
var _ = require('lodash');
var qiniu = require('qiniu');
var config = require('../config');

//同步多说评论
exports.synccomments = function (req, res) {
  var secret = '532e232e6c639993343c09668e45b621',
    short_name = 'panblog',
    url = 'http://api.duoshuo.com/log/list.json?short_name=' + short_name + '&secret=' + secret + '&limit=3&order=desc',
    data = '', item = '';
  http.get(url, function (result) {
    result.on('data', function (results) {
      data = JSON.parse(results);
      item = data.response[0];
      if (item.action === "delete") {
        Article.find({comment_ids: {$in: item.meta}}, function (err, articles) {
          if (err) {
            console.log('err', err);
          }
          else {
            articles[0].comment_ids = _.difference(articles[0].comment_ids, item.meta);
            articles[0].save();
          }
        })
      }
      else if (item.action === 'create' && item.meta.status === 'approved') {
        Article.findById(item.meta.thread_key).exec()
          .then(function (article) {
            article.comment_ids.push(item.meta.post_id);
            article.save();
          })
          .then(null, function (err) {
            console.log(err);
          })
      }
    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
  return res.json(200);
};

//返回七牛token
exports.qnuptoken = function (req, res) {
  qiniu.conf.ACCESS_KEY = config.qn.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = config.qn.SECRET_KEY;
  var uptoken = new qiniu.rs.PutPolicy(config.qn.Bucket_Name);
  var token = uptoken.token();
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      uptoken: token
    });
  }
};