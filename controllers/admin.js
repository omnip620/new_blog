/**
 * Created by panew on 14-12-5.
 */
exports.show = function (req, res) {
  res.render('admin/index', {layout: false,categeories:[{name:"设置",url:"#/"},{name:"文章",url:"#/articles"}]});
};
exports.categories = function (req, res) {
  var categeories = [{name:"设置",url:"javascript:;"},{name:"文章",url:"javascript:;"}];
  res.json(categeories);
};