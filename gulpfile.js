/*eslint-env node */

const gulp = require('gulp'),
  rename = require('gulp-rename'),
  cleanCSS = require('gulp-clean-css'),
  concatCss = require('gulp-concat-css'),
  jshint = require('gulp-jshint'),
  minify = require('gulp-minify'),
  w3cjs = require('gulp-w3cjs');

gulp.task('w3cjs', function () {
    gulp.src('index.html')
        .pipe(w3cjs())
        .pipe(w3cjs.reporter());
});

gulp.task('compress', function() {
  gulp.src('js/app.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],

    }))
    .pipe(gulp.dest('dist'))
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('js/app.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minify-css', function() {
    gulp.src('css/*.css')
    .pipe(concatCss('min.css'))
    .pipe(cleanCSS({debug: true}, function(details) {
          console.log(details.name + ': ' + details.stats.originalSize);
          console.log(details.name + ': ' + details.stats.minifiedSize);
    }))
    .pipe(gulp.dest('css/'));
});




gulp.task('watch', function() {
  // place code for your default task here
  gulp.watch('css/*',['minify-css']);
  gulp.watch('js/*.js', ['jshint']);
  gulp.watch('js/*.js', ['compress']);
  gulp.watch('index.html', ['w3cjs']);
});

gulp.task('default', ['minify-css', 'watch', 'jshint', 'compress', 'w3cjs']);
