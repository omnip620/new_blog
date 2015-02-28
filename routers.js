/**
 * Created by panew on 14-12-5.
 */
var express = require('express');
var router = express.Router();
var index=require('./controllers/index');
var article=require('./controllers/article');
var admin=require('./controllers/admin');
var errors=require('./controllers/errors');
var auth=require('./common/auth');


router.get('/page',index.page);
router.get('/',index.show);
router.get('/article/:id',article.show);
router.get('/tags/:id',index.tags);
router.get('/archive',index.archive);
router.get('/login',index.login);
router.post('/login',index.loginto);
router.get('/qnuptoken',admin.qnuptoken);

router.all('/api/*', auth.userRequired);
router.use('/api',require('./api/admin'));
router.use('/common',require('./common'));

router.get('/404',errors[404]);

module.exports = router;