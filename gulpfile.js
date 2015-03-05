'use strict';

var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();

gulp.task('hint', function () {
    return gulp.src('src/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('clean', function() {
	return del([
		'dist/*.js'
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

gulp.task('default', ['hint', 'clean', 'compress']);