const gulp = require('gulp');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');
const pug = require('gulp-pug');
const paths = require('../paths');

gulp.task('pug', () =>
  gulp.src([
    `${paths.SRC}pug/**/*.pug`,
    `!${paths.SRC}pug/_*.pug`,
    `!${paths.SRC}pug/**/_*.pug`,
  ])
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(paths.DIST)));

gulp.task('pugReload', callback => runSequence('pug', 'bsReload', callback));
