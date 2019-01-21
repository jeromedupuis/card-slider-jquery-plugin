const gulp = require('gulp');
const paths = require('../paths');

gulp.task('watch', () => {
  gulp.watch([`${paths.SRC}pug/**/*.pug`], ['pugReload']);
  gulp.watch([`${paths.SRC}sass/**/*.scss`], ['sassReload']);
  gulp.watch([`${paths.SRC}js/**/*.js`], ['jsReload']);
  gulp.watch([`${paths.SRC}js/**/*.js`], ['lint']);
});
