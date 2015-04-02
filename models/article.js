/**
 * Created by panew on 14-12-7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
  title      : {type: String},
  content    : {type: String},
  source     : {type: String},
  top        : {type: Boolean, default: false},
  created_at : {type: Date, default: Date.now},
  updated_at : {type: Date, default: Date.now},
  views      : {type: Number, default: 0},
  comment_ids: {type: Array, default: []},
  tag_ids    : {type: Array, default: []},
  cat        : {type: Number}
}, {
  toJSON: {virtuals: true}
});

ArticleSchema.methods.getTags = function (Tag, cb) {
  Tag.find({_id: {$in: this.tag_ids}}).exec()
    .then(function (tags) {
      cb(null, tags.length ? tags.map(function (tag) {
        return tag.name
      }) : [])
    })
    .then(null, function (err) {
      cb(err)
    });
};

ArticleSchema.virtual('comments').get(function () {
  return this.comment_ids ? this.comment_ids.length : 0;
});

ArticleSchema.pre('remove', function (next) {
  next();
});


ArticleSchema.index({created_at: -1});

module.exports = mongoose.model('Article', ArticleSchema);