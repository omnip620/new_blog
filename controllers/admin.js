/**
 * Created by panew on 14-12-5.
 */

var qiniu = require('qiniu');
var config=require('../config')

qiniu.conf.ACCESS_KEY=config.qn.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.qn.SECRET_KEY;

var uptoken = new qiniu.rs.PutPolicy(config.qn.Bucket_Name);
exports.show = function (req, res) {
  if(req.path.indexOf('/admin')>=0){
    res.render('admin/index', {layout: false,categeories:[{name:"设置",url:"/admin"},{name:"文章",url:"/admin/articles"}]});
  }
};
exports.qnuptoken=function(req,res){
  var token=uptoken.token();
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      uptoken: token
    });
  }
};