/**
 * Created by panew on 14-12-5.
 */
var Article = require('../models/article');
var md = require('markdown-it')({html: true, linkify: true, typographer: true});

exports.show = function (req, res) {
  Article.findById(req.params.id, function (err, article) {
    if (err) {
      return res.redirect('/404')
    }
    article.update({$inc: {views: 1}}, {w: 1}).exec();
    if (article.content) {
      article.content = md.render(article.content)
    }
    return res.render('article', article);
  });
};
