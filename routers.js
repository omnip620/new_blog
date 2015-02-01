/**
 * Created by panew on 14-12-5.
 */
var express = require('express');
var router = express.Router();
var index=require('./controllers/index');
var article=require('./controllers/article');
var admin=require('./controllers/admin');
var errors=require('./controllers/errors');


router.get('/',index.show);
router.get('/page',index.page);
router.get('/article/:id',article.show);
router.get('/qnuptoken',admin.qnuptoken);

router.use('/api/articles',require('./api/articles'));
router.get('/404',errors[404]);
//router.use('/api/admin',require('./api/admin'));

module.exports = router;