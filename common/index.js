/**
 * Created by panew on 15-2-24.
 */
var express = require('express');

var router = express.Router();

router.get('/sc',require('./synccomments.js').index);