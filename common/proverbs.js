/**
 * Created by panew on 15-6-9.
 */
var fs = require("fs");
var moment = require('moment');
var cache = require('../service/cache');
var Promise = require('bluebird');
var data = fs.readFileSync('./public/proverbs.txt', 'utf-8').split(/\t{1,2}|\r{1,2}|\n{1,2}/gi);
var oldDate = data[0];
var dateNow = moment().format("YYYY-MM-DD");


module.exports = function (req, res, next) {
  var cacheGetAsync = Promise.promisify(cache.get);
  cacheGetAsync('proverbs').then(function (proverbs) {
    if (proverbs) {
      res.locals.proverbs = proverbs;
    } else {
      if (oldDate != dateNow) {
        data[0] = dateNow;
        data[1]++;
        fs.writeFileSync('./public/proverbs.txt', data.join('\n\n'));
      }
      cache.set('proverbs', data[data[1]], 7200);
      res.locals.proverbs = data[data[1]];
    }
  });


  return next()
};