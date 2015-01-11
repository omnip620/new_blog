/**
 * Created by panew on 14-12-5.
 */
exports.show = function (req, res) {
  if(req.path.indexOf('/admin')>=0){
    res.render('admin/index', {layout: false,categeories:[{name:"设置",url:"/admin"},{name:"文章",url:"/admin/articles"}]});
  }
};