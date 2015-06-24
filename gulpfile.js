'use strict';

var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var bowerMain = require('bower-main');
var $ = require('gulp-load-plugins')();
var bowerMainJavaScriptFiles = bowerMain('js','min.js');

gulp.task('hint', function () {
    return gulp.src('src/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('clean', function() {
	return del([
		'dist'
	]);
});

gulp.task('compress', function() {
  	return gulp.src('src/*.js')
   		.pipe($.uglify())
   		.pipe($.rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('bowerfiles', function(){
  return gulp.src(bowerMainJavaScriptFiles.normal)
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest('examples/scripts/'));
});

gulp.task('merge', function(){
  return gulp.src(['examples/vendor/*.js', 'src/*.js'])
    .pipe($.uglify())
    .pipe($.concat('html5videokeyframes.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', function () {
    browserSync.init(null, {
        server: {
            baseDir: 'examples',
            directory: true
        },
        debugInfo: false,
        open: false,
        hostnameSuffix: ""
    }, function (err, bs) {
        require('opn')(bs.options.getIn(['urls', 'local']));
        console.log('Started connect web server on ' + bs.options.url);
    });
});

gulp.task('default', ['hint', 'compress']);

gulp.task('watch', ['bowerfiles', 'serve'], function () {
    gulp.watch('src/*.js', function(){
      gulp.src('src/html5videokeyframes.js')
        .pipe(gulp.dest('examples/scripts'));
    });
    gulp.watch(['examples/*.html', 'examples.*xml'], reload);
});

gulp.task('build', function(){
  runSequence(
    'hint',
    'bowerfiles',
    'merge');
});

