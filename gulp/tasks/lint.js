const gulp = require('gulp');
const eslint = require('gulp-eslint');
const paths = require('../paths');

gulp.task('lint', () =>
  gulp.src([`${paths.SRC}js/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format()));
