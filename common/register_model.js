/**
 * Created by panew on 15-3-4.
 */
var tagmap = require('../models/tagmap');
var tag = require('../models/tag');

module.exports = function (pew) {
  pew.db.tagmap = tagmap;
  pew.db.tag = tag;
};