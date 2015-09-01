/**
 * Created by panew on 15-4-25.
 */
var Article = require('../models/article');
var xmlbuilder = require('xmlbuilder');
var cache = require('./../service/cache');


exports.sitemap = function (req, res) {
  cache.get('sitemap', function (sitemapData) {
    if (sitemapData) {
      return res.type('xml').send(sitemapData);
    }
    var urlset = xmlbuilder.create('urlset',
      {version: '1.0', encoding: 'UTF-8'});

    urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    Article.find({}, '_id', {sort: '-updated_at'}, function (err, articles) {
      if (err) {
        console.log(err);
        return err;
      }
      articles.forEach(function (article) {
        urlset.ele('url').ele('loc', 'http://www.ewpan.com/article/' + article._id);
      });
      var sitemapData = urlset.end();
      cache.set('sitemap', sitemapData, 3600 * 24);
      return res.type('xml').send(sitemapData);
    })
  })
};