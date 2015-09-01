/**
 * Created by panew on 15-2-24.
 */
var express = require('express');
var othersource=require('./othersource.js');


var router = express.Router();

router.post('/sc',othersource.synccomments);
router.get('/qnuptoken',othersource.qnuptoken);

module.exports = router;