var gulp            = require('gulp'),
    webpack         = require('webpack'),
    nodemon         = require('gulp-nodemon'),
    inject          = require('gulp-inject'),
    order           = require('gulp-order'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    minifyCSS       = require('gulp-minify-css'),
    clean           = require('gulp-clean'),
    git             = require('gulp-git'),
    runSequence     = require('run-sequence'),
    browserSync     = require('browser-sync').create(),
    shortId         = require('shortid'),
    randomId        = '',
    stylus          = require('gulp-stylus');

var frontPaths = {
  scripts: ['public/javascripts/jquery.min.js',
    'public/javascripts/handlebars.runtime.min.js',
    'public/javascripts/sidebarEffects.js',
    'public/javascripts/moment.js',
    'public/javascripts/app.jsx'],
  css    : ['public/stylesheets/font.css', 'public/stylesheets/style.css'],
  images : 'client/img/**/*'
};

gulp.task('clean', function () {
  return gulp.src(['public/**/all*.*'], {read: false})
    .pipe(clean());
});

gulp.task('frontJS', function () {
  return gulp.src(frontPaths.scripts)
    .pipe(uglify())
    .pipe(concat('all-' + randomId + '.min.js'))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('frontCSS', function () {
  return gulp.src(frontPaths.css)
    .pipe(concat('all-' + randomId + '.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('frontInject', ['frontJS', 'frontCSS'], function () {
  return gulp.src('views/layouts/layout.hbs')
    .pipe(inject(gulp.src(['public/javascripts/all*.js', 'public/stylesheets/all*.css']), {'ignorePath': 'public'}))
    .pipe(gulp.dest('views/layouts'));
});

gulp.task('frontInjectDev', function () {
  return gulp.src('views/layouts/layout.hbs')
    .pipe(inject(gulp.src(frontPaths.css.concat(frontPaths.scripts)), {'ignorePath': 'public'}))
    .pipe(gulp.dest('views/layouts'));
});

gulp.task('add', ['frontInject'], function () {
  return gulp.src('public/**/all*.*')
    .pipe(git.add());
});
gulp.task('build', function () {
  randomId = shortId.generate();
  return runSequence('clean', 'add');
});

gulp.task('browser-sync', function () {
  browserSync.init({
    proxy: "panblog.com"
  });
  gulp.watch(['public/**/*.js', 'public/**/*.css', 'views/**/*.hbs']).on("change", browserSync.reload);
});

gulp.task('compileStylus', function () {
  gulp.src('public/stylesheets/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('public/stylesheets/'));

});

gulp.task('nodemonStart', function () {
  nodemon({
    "verbose": true,
    "script" : 'bin/www',
    "ext"    : 'js',
    "ignore" : ['public', '.idea', 'config.js', 'gulpfile.js', '*.hbs','node_modules','.git'],
    //'nodeArgs': ['--debug']
  })
});

gulp.task('react-common', function () {
  return gulp.src(['public/admin-react/react.js',
    'public/javascripts/jquery.min.js',
    'public/javascripts/moment.js',
    'public/javascripts/page.js',
    'public/javascripts/materialize.min.js',
    'public/javascripts/typeahead.bundle.min.js',
    'public/javascripts/materialize-tags.js',
    'public/javascripts/lodash.min.js'])
    .pipe(concat('common.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/admin-react'));
});


var compiler = webpack({
  entry  : {
    app: "./public/admin-react/app.jsx",
    //common: ["react", "jquery", "lodash", "moment"]
  },
  output : {
    path    : __dirname + "/public/admin-react",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module : {
    loaders: [
      {test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin("common", "common.js"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      exclude : 'bundle.js'
    })
  ]
});

gulp.task('webpackCompile', function () {
  compiler.run(function (err, stats) {
    if (err) {
      return console.log(err)
    }
    console.log(stats.toString({colors: true}))
  })
});

gulp.task('reactEditor', function () {
  return gulp.src([
    'public/editor/codemirror.js',
    'public/editor/overlay.js',
    'public/editor/xml.js',
    'public/editor/markdown.js',
    'public/editor/gfm.js',
    'public/editor/javascript.js',
    'public/editor/css.js',
    'public/editor/stylus.js',
    'public/editor/htmlmixed.js',
    'public/editor/fullscreen.js',
    'public/editor/meta.js'])
    .pipe(concat('editor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/admin-react'));
});

gulp.task('watch', function () {
  gulp.watch('public/stylesheets/*.styl', ['compileStylus']);
  gulp.watch([frontPaths.scripts, frontPaths.css], ['frontInjectDev']);
  //gulp.watch(['public/admin-react/app.jsx'], ['webpackCompile']);
});


gulp.task('default', ['watch', 'browser-sync', 'nodemonStart']);
