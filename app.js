var config = require('./config');
if (!config.debug) {
  require('newrelic');
}
var express = require('express');
var compress = require('compression');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exhbs = require('express-handlebars');
var routers = require('./routers');
var mongoose = require('mongoose');
var moment = require('moment');
var session = require('express-session');
var Article = require('./models/article');
var Tag = require('./models/tag');
//var registerModels = require('./common/register_model')
var app = express();

if (process.env.VCAP_SERVICES) {
  var mongodb_config = JSON.parse(process.env.VCAP_SERVICES).mongodb[0].credentials;
  config.db.host = mongodb_config.host;
  config.db.port = mongodb_config.port;
  config.db.user = mongodb_config.username;
  config.db.pwd = mongodb_config.password;
  config.db.database = mongodb_config.name;
}
var dburi = 'mongodb://' + config.db.user + ':' + config.db.pwd + '@' + config.db.host + ':' + config.db.port + '/' + config.db.database;
mongoose.connect(dburi, function (err) {
  if (err) {
    console.error('connect to %s error: ', dburi, err.message);
    process.exit(1);
  }
});

//registerModels(app);

// view engine setup
app.engine('hbs', exhbs({
  extname      : 'hbs',
  defaultLayout: 'layout',
  helpers      : {
    block      : function (name) {
      var blocks = this._blocks;
      content = blocks && blocks[name];
      return content ? content.join('\n') : null;
    },
    contentFor : function (name, options) {
      var blocks = this._blocks || (this._blocks = {}),
          block = blocks[name] || (blocks[name] = []);

      block.push(options.fn(this));
    },
    formatDate : function (item) {
      if (moment().isSame(item, 'day')) {
        return moment(item).format('HH:mm');
      }
      return moment(item).format('MM-DD HH:mm');
    },
    getDay     : function (item) {
      return moment(item).format('DD');
    },
    titlesplice: function (title) {
      return title.length > 16 ? title.substring(0.16) : title;
    }
  }
}));
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
  resave           : true,
  saveUninitialized: true
}));

//right sidebar data bind
app.use(function (req, res, next) {
  Article.find({}, 'title views', {sort: '-views', limit: 5}).exec()
    .then(function (result) {
      res.locals.topViews = result;
      return Tag.find({}).exec();
    })
    .then(function (result) {
      res.locals.tagList = result;
      return Article.find({}, 'title comment_ids', {limit: 5, sort: '-comment_ids'}).exec();
    })
    .then(function (result) {
      res.locals.topComments = result;
      next();
    })
    .then(null, function (err) {
      return res.redirect('/404')
    })
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
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error  : {}
  });
});


module.exports = app;
