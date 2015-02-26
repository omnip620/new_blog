/**
 * Created by panew on 15-2-24.
 */

var http = require('http');
exports.index = function (req, res) {
  console.log(req.action)
  var secret = '532e232e6c639993343c09668e45b621',
    short_name = 'panblog',
    url = 'http://api.duoshuo.com/log/list.json?short_name=' + short_name + '&secret=' + secret+'&limit=5&order=desc';
  http.get(url, function (res) {
    console.log("Got response: " + res.statusCode);
    res.on('data', function (data) {
      console.log("Got data: " + data);
    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });

  return res.json(200);
};