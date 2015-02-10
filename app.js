var express = require('express');
var compress = require('compression')
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exhbs = require('express-handlebars');
var routers = require('./routers');
var mongoose = require('mongoose');
var config = require('./config');
var moment = require('moment');

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


// view engine setup
app.engine('hbs', exhbs({
  extname: 'hbs', defaultLayout: 'layout', helpers: {
    block: function (name) {
      var blocks = this._blocks;
      content = blocks && blocks[name];

      return content ? content.join('\n') : null;
    },
    contentFor: function (name, options) {
      var blocks = this._blocks || (this._blocks = {}),
        block = blocks[name] || (blocks[name] = []);

      block.push(options.fn(this));
    },
    formatDate: function (item) {
      if (moment().isSame(item, 'day')) {
        return moment(item).format('HH:mm');
      }
      return moment(item).format('MM-DD HH:mm');
    }
  }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compress({
  level:9
}));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routers);

///admin router
app.use(function (req, res) {
  var cats = [
    {name: "设置", url: "/admin"},
    {name: "文章", url: "/admin/articles"},
    {name: "标签", url: "/admin/tags"}
  ];
  if (req.path.indexOf('/admin') >= 0) {
    res.render('admin/index', {
      layout: false,
      categeories:cats
    });
  }
});


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
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
