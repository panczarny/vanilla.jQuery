const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');

gulp.task('browser-sync', () =>
  browserSync.init({
    server: {
      baseDir: './'
    },
    files: [
    'q.js',
    'modules/*.js',
    'scripts.js',
    'index.html'
    ]
  })
  );

gulp.task('lint', () =>
  gulp.src([
    'q.js',
    'modules/*.js',
    ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  );

gulp.task('serve', ['browser-sync']);

gulp.task('default', ['serve']);
