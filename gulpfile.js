'use strict';

var gulp = require('gulp');
var del = require('del');
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
		'dist/temp'
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
    .pipe(gulp.dest('dist/temp'));
});

gulp.task('merge', function(){
  return gulp.src(['dist/temp/*.js', 'src/*.js'])
    .pipe($.uglify())
    .pipe($.concat('html5videokeyframes.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['hint', 'compress']);
gulp.task('build', function(){
  runSequence(
    'hint',
    'bowerfiles',
    'merge',
    'clean');
})