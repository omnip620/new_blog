/**
 * Created by panew on 15-2-24.
 */

var http = require('http');
var Article = require('./../models/article');
var _ = require('lodash');
exports.index = function (req, res) {

  var secret = '532e232e6c639993343c09668e45b621',
    short_name = 'panblog',
    url = 'http://api.duoshuo.com/log/list.json?short_name=' + short_name + '&secret=' + secret + '&limit=3&order=desc',
    data = '', item = '';

  http.get(url, function (res) {
    console.log("Got response: " + res.statusCode);
    res.on('data', function (results) {
      data = JSON.parse(results);
      console.log("Got data: " + data);
      item = data.response;
      item = item[0];
      if (item.action === "delete") {
        Article.find({comment_ids: {$in: item.meta}}, function (err, articles) {
          if (err) {
            console.log('err', err);
          }
          else {
            articles[0]._doc.comment_ids = _.difference(articles[0]._doc.comment_ids, item.meta);
            articles[0].save();
            console.log(articles);
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