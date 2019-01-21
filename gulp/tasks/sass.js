const gulp = require('gulp');
const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const plumber = require('gulp-plumber');
const pleeease = require('gulp-pleeease');
const cssmin = require('gulp-cssmin');
const paths = require('../paths');

gulp.task('sass', () =>
  gulp.src(`${paths.SRC}sass/style.scss`)
    .pipe(plumber())
    .pipe(sass()).on('error', console.error.bind(console))
    .pipe(pleeease({
      minifier: false,
      autoprefixer: {
        browsers: ['last 4 versions'],
      },
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(`${paths.DIST}css`)));

gulp.task('sassReload', callback => runSequence('sass', 'bsReload', callback));
