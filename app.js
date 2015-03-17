var config = require('./config');
var env = process.env.NODE_ENV;
if (env === "production") {
  require('newrelic');
}
//数据库连接
require('./service/dbconnect')(config);

var express = require('express');
var compress = require('compression');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exhbs = require('express-handlebars');
var routers = require('./routers');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var rsb = require('./common/rightsidebar');
var hbshelper=require('./common/hbshelper');
//var registerModels = require('./common/register_model')
var app = express();
//registerModels(app);
// view engine setup
app.engine('hbs', exhbs(hbshelper));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compress());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31536000}));
app.use(session({
  secret           : 'panblog',
  store            : new MongoStore({
    host    : config.db.host,
    port    : config.db.port,
    db      : config.db.database,
    username: config.db.user,
    password: config.db.pwd
  }),
  resave           : true,
  saveUninitialized: true,
  cookie           : {maxAge: 3600 * 24}
}));

//right sidebar data bind and set env to views
app.use(rsb,function(req,res,next){
  res.locals.production = env === "production";
  next()
});

app.use('/', routers);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error  : err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res,next) {
  res.redirect('/'+err.status||500);
});


module.exports = app;
