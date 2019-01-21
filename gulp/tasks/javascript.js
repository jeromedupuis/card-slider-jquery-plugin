const gulp = require('gulp');
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.config');
const paths = require('../paths');

gulp.task('javascript', () => webpackStream(webpackConfig, webpack).pipe(gulp.dest(`${paths.DIST}js`)));

gulp.task('jsReload', callback => runSequence('javascript', 'bsReload', callback));
