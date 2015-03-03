'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
    return gulp.src('src/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['app/styles/main.css', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});


gulp.task('watch', ['serve'], function () {
    gulp.watch('src/**/*.js', ['scripts']);
});
