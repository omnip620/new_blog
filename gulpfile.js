var gulp            = require('gulp'),
    livereload      = require('gulp-livereload'),
    inject          = require('gulp-inject'),
    order           = require('gulp-order'),
    angularFilesort = require('gulp-angular-filesort'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    minifyCSS       = require('gulp-minify-css'),
    clean           = require('gulp-clean'),
    git             = require('gulp-git'),
    runSequence     = require('run-sequence'),
    browserSync     = require('browser-sync').create(),
    shortId         = require('shortid'),
    nodemon         = require('gulp-nodemon'),
    randomId        = '',
    stylus          = require('gulp-stylus');


livereload({start: true});

gulp.task('all', function () {
  gulp.src('public/**/*.*')
    .pipe(livereload());
});

gulp.task('inject', function () {
  return gulp.src('views/admin/index.hbs')
    .pipe(inject(gulp.src(['public/admin/**/*.js']).pipe(angularFilesort()), {'ignorePath': 'public'}))
    .pipe(gulp.dest('views/admin'));
});

var frontPaths = {
  scripts: ['public/javascripts/jquery.min.js',
    'public/javascripts/handlebars.runtime.min.js',
    'public/javascripts/sidebarEffects.js',
    'public/javascripts/moment.js',
    'public/javascripts/app.js'],
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
  gulp.watch(['public/**/*.*']).on("change", browserSync.reload);
});

gulp.task('compileStylus', function () {
  gulp.src('public/stylesheets/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('public/stylesheets/'));

});

gulp.task('nodemonStart', function () {
  nodemon({
    "verbose" : true,
    "script"  : 'bin/www',
    "ext"     : 'js',
    "ignore"  : ['public', '.idea', 'config.js', 'gulpfile.js', '*.hbs'],
    //'nodeArgs': ['--debug']
  })
});

gulp.task('watch', function () {
  //gulp.watch([frontPaths.scripts, frontPaths.css], ['build'])
  gulp.watch('public/stylesheets/*.styl', ['compileStylus']);
  gulp.watch([frontPaths.scripts, frontPaths.css], ['frontInjectDev']);
});

gulp.task('default', ['watch', 'browser-sync','nodemonStart']);
