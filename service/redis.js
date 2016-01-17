/**
 * Created by panew on 15-4-26.
 */
var redis = require('redis');
var config = require('../config');
var client = redis.createClient(config.redis.port);

client.on("error", function (err) {
  console.log("Error " + err);
});

exports = module.exports = client;