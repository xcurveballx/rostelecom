'use strict';
const browserify = require('browserify');
const gulp = require('gulp');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const sequence = require('gulp-sequence');
//const pump = require('pump');
const path = require('path');
const cached = require('gulp-cached');
const remember = require('gulp-remember');

const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

const uglify = require('gulp-uglify');
const babelify = require("babelify");
//const babel = require('gulp-babel');

const log = require('gulplog');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development',
      folders = {
	      src: './assets/',
	      dest: './public/'
      };

gulp.task('css', function () {
  return gulp.src(folders.src + 'css/**/*.sass')
    .pipe(cached('css'))
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(remember('css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(folders.dest + 'css'));
});

gulp.task('js', function () {
  var b = browserify({
    entries: folders.src + 'js/app.js',
    debug: !isDev
  });

  return b.transform(babelify.configure({presets: ["env"]}))
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(isDev, sourcemaps.init({loadMaps: true})))
    .pipe(uglify()).on('error', log.error)
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(folders.dest +'js'));
});

gulp.task('watch', function() {

  gulp.watch(folders.src + 'js/**/*.js', gulp.series('js'));

  gulp.watch(folders.src + 'css/**/*.sass', gulp.series('css')).on('unlink', function(filepath) {
    remember.forget('css', path.resolve(filepath));
    delete cached.caches.css[path.resolve(filepath)];
  });
});

gulp.task('default', gulp.series(gulp.parallel('css', 'js'), 'watch'));
