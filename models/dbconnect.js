/**
 * Created by panew on 14-12-7.
 */
var mongoose=require('mongoose');
var config=require('../config');

mongoose.connect(config.db,function(err){
  if(err){
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});
