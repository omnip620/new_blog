/**
 * Created by panew on 15-2-3.
 */
var mongoose = require('mongoose');
var shortId = require('shortid');
var Schema = mongoose.Schema;
var ObjectID = Schema.ObjectId;

var Tag= new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortId.generate
  },
  name: {type: String}
});

Tag.index({name: -1});

module.exports = mongoose.model('Tag', Tag);