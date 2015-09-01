/**
 * Created by panew on 15-3-17.
 */
var mongoose = require('mongoose');
module.exports = function (config) {
  if (process.env.VCAP_SERVICES) {
    var mongodb_config = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials;
    config.db.host = mongodb_config.host;
    config.db.port = mongodb_config.port;
    config.db.user = mongodb_config.username;
    config.db.pwd = mongodb_config.password;
    config.db.database = mongodb_config.name;
  }
  var dburi = 'mongodb://' + config.db.user + ':' + config.db.pwd + '@' + config.db.host + ':' + config.db.port + '/' + config.db.database;
  mongoose.connect(dburi, function (err) {
    if (err) {
      console.error('connect to %s error: ', dburi, err.message);
      process.exit(1);
    }
  });
};