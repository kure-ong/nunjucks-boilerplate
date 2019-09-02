'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    del = require('del'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    modernizr = require('gulp-modernizr'),
    browserSync = require('browser-sync').create(),
    nunjucksRender = require('gulp-nunjucks-render');

sass.compiler = require('node-sass');


gulp.task('clean', function (done) {
  del(['dist/**/*']);
  // cache.clearAll();
  done();
});

// gulp.task('clean:cache', function (done) {
//   cache.clearAll();
//   done();
// });

gulp.task('sass', function () {
  var plugins = [
    autoprefixer(),
  ];
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts:vendor', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
  ])
    .pipe(gulpif('!jquery.min.js',concat('bundle.js')))
    .pipe(gulp.dest('dist/js/vendor'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src(['src/js/**/*.js', '!src/js/vendor/**'])
    // .pipe(uglify()) //need to install uglify plugin to use
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('modernizr', function() {
  return gulp.src(['src/js/**/*.js', '!src/js/vendor/**'])
    .pipe(modernizr())
    .pipe(gulp.dest('dist/js/vendor'))
    .pipe(browserSync.stream());
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/pages/**/*.+(html|nunjucks|njk)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());
});

gulp.task('img', function() {
	return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(cache(
    // .pipe(
      imagemin([
        // Setting interlaced to true
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 8})
      ])
    )
    )
		.pipe(gulp.dest('dist/img'));
});

gulp.task('copy:files', function () {
  return gulp.src([
    'src/fonts/**/*',
  ],{base: 'src/'})
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('copy:code', function () {
  return gulp.src([
    'src/data/**/*',
    'src/scripts/**/*',
  ],{base: 'src/'})
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('serve', function() {
  browserSync.init({
      // proxy: "yourlocal.dev",
      server: {
        baseDir: "dist/"
      },
      https: true
  });

  gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('src/js/**/*.js', gulp.series('modernizr','scripts'));
  gulp.watch('src/**/*.(html|nunjucks|njk)', gulp.series('nunjucks'));
  gulp.watch('src/img/**/*.+(jpg|jpeg|gif|png|svg)', gulp.series('img'));
  gulp.watch(['src/fonts/**/*'], gulp.series('copy:files'));
  gulp.watch(['src/data/**/*','src/scripts/**/*'], gulp.series('copy:code'));
});

gulp.task('build', gulp.series('clean','copy:files','copy:code','scripts:vendor','modernizr','scripts','sass','nunjucks','img'));
gulp.task('default', gulp.series('build','serve'));
