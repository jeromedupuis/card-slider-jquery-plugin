const gulp = require('gulp');
const browserSync = require('browser-sync');
const paths = require('../paths');

gulp.task('server', () =>
  browserSync({
    port: 3000,
    open: 'external',
    server: {
      baseDir: [paths.DIST],
    },
    notify: false,
    ghostMode: false,
    browser: "Google chrome"
  }));

gulp.task('bsReload', () => browserSync.reload());
