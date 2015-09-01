/**
 * Created by panew on 15-6-11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProverbsCounter = new Schema({
  date    : {type: Date, default: Date.now},
  counters: {type: Number}
}, {
  toJSON: {virtuals: true}
});


module.exports = mongoose.model('ProverbsCounter', ProverbsCounter);