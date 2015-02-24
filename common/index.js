/**
 * Created by panew on 15-2-24.
 */
var express = require('express');
var sc=require('./synccomments.js');


var router = express.Router();

router.post('/sc',sc.index);

module.exports = router;