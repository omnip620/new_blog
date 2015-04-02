/**
 * Created by panew on 14-12-5.
 */
var Article = require('../models/article');
var TagMap = require('../models/tagmap');
var Tag = require('../models/tag');
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
    article.getTags(Tag,function (err, tags) {
      article.tags = tags;
      return res.render('article', article);
    })
  });
};
