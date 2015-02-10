/**
 * Created by panew on 15-2-4.
 */
var mongoose = require('mongoose');
var shortId = require('shortid');
var Schema = mongoose.Schema;
var ObjectID = Schema.ObjectId;

var TagMapSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    default: shortId.generate
  },
  article_id: {type: String},
  tag_id: {type: String}
});


TagMapSchema.index({article_id: 1, tag_id: 1});

module.exports = mongoose.model('TagMap', TagMapSchema);