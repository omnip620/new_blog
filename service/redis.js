/**
 * Created by panew on 15-4-26.
 */
var redis = require('redis');
var client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

exports = module.exports = client;