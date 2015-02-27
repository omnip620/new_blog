/**
 * Created by panew on 14-12-7.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = Schema.ObjectId;


var ArticleSchema = new Schema({
  title: {type: String},
  content: {type: String},
  source: {type: String},
  top: {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  views: {type: Number, default: 0},
  comment_ids: {type: Array, default: []},
  cat: {type: Number}
}, {
  toJSON: {virtuals: true}
});

ArticleSchema.methods.getTags = function (cb) {
  D.tagmap.find({article_id: this._id}).exec()
    .then(function (result) {
      return result.length ? D.tag.find({
        _id: {
          $in: result.map(function (item) {
            return item.tag_id;
          })
        }
      }).exec() : []
    })
    .then(function (tags) {
      cb(null, tags.length ? tags.map(function (tag) {
        return tag.name;
      }) : []);
    })
    .then(null, function (e) {
      cb(e);
    })
};

ArticleSchema.virtual('comments').get(function () {
    console.log(this.comment_ids )
  return this.comment_ids ? this.comment_ids.length : 0;
});

ArticleSchema.pre('remove', function (next) {
  next();
});


ArticleSchema.index({created_at: -1});

module.exports = mongoose.model('Article', ArticleSchema);