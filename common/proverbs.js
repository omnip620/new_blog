/**
 * Created by panew on 15-6-9.
 */
var fs = require("fs");
var cache = require('../service/cache');
var Promise = require('bluebird');
var schedule = require('node-schedule');
var data = fs.readFileSync('./public/proverbs.txt', 'utf-8').split(/\t{1,2}|\r{1,2}|\n{1,2}/gi);

exports.set = function () {
  var j = schedule.scheduleJob('0 0 * * *', function () {
    setProverbCache();
  });
};

function setProverbCache() {
  cache.set('proverbs', data[data[0]]);
  data[0]++;
  if (+data[0] >= data.length) {
    data[0] = 1;
  }
  fs.writeFileSync('./public/proverbs.txt', data.join('\n\n'));
}

exports.get = function (req, res, next) {
  var cga = Promise.promisify(cache.get);
  cga('proverbs').then(function (proverb) {
    if (proverb) {
      res.locals.proverbs = proverb;
      return next()
    }
    cache.set('proverbs', data[data[0]]);
    res.locals.proverbs = data[data[0]];
    return next()
  })
};