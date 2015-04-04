/**
 * Created by panew on 15-3-4.
 */
var tag = require('../models/tag');

module.exports = function (pew) {
  pew.db.tag = tag;
};