/**
 * Created by panew on 14-12-5.
 */
var express = require('express');
var router = express.Router();
var index=require('./controllers/index');
var article=require('./controllers/article');
var admin=require('./controllers/admin');


router.get('/',index.show);
router.get('/article',article.show);
router.get('/qnuptoken',admin.qnuptoken);

router.use('/api/articles',require('./api/articles'));
//router.use('/api/admin',require('./api/admin'));

module.exports = router;