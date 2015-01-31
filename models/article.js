/**
 * Created by panew on 14-12-7.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectID=Schema.ObjectId;


var ArticleSchema=new Schema({
  title:{type:String},
  content:{type:String},
  source:{type:String},
  top:{type:Boolean,default:false},
  created_at:{type:Date,default:Date.now},
  updated_at:{type:Date,default:Date.now},
  tags:{type:Array},
  views:{type:Number,default:0},
  comments:{type:Number,default:0},
  cat:{type:Number}
});

ArticleSchema.index({created_at:-1});

module.exports=mongoose.model('Article',ArticleSchema);