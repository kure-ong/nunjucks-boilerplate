'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    data = require('gulp-data'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    modernizr = require('gulp-modernizr'),
    nunjucksRender = require('gulp-nunjucks-render'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    fs = require('fs');

sass.compiler = require('node-sass');

const rootDir = 'dist',
    publicDir = 'dist';

gulp.task('clean', function (done) {
    del(['dist/**/*']);
    // cache.clearAll();
    done();
});

// -- uncomment to clear cache for image processing when images seem to not get optimised
gulp.task('clean:cache', function (done) {
    cache.clearAll();
    done();
});

gulp.task('sass', function () {
    var plugins = [
        autoprefixer(),
    ];
    return gulp.src('src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(publicDir + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts:vendor', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/popper.js/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
        'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
    ])
        .pipe(gulpif('!jquery.min.js', concat('bundle.js')))
        .pipe(gulp.dest(publicDir + '/js/vendor'));
});

gulp.task('scripts', function () {
    return gulp.src(['src/js/**/*.js', '!src/js/vendor/**'])
        // .pipe(uglify()) //need to install uglify plugin to use
        .pipe(gulp.dest(publicDir + '/js'))
        .pipe(browserSync.stream());
});

gulp.task('modernizr', function () {
    return gulp.src(['src/js/**/*.js', '!src/js/vendor/**'])
        .pipe(modernizr())
        .pipe(gulp.dest(publicDir + '/js/vendor'))
        .pipe(browserSync.stream());
});

gulp.task('nunjucks', function () {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/pages/**/*.+(html|nunjucks|njk)')
        //-- Adds data from the JSON to nunjucks
        // .pipe(data(function() {
        //   return JSON.parse(fs.readFileSync('./src/data/carousels.json'));
        // }))
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest(rootDir))
        .pipe(browserSync.stream());
});

gulp.task('img', function () {
    return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 7 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ], {
                verbose: true
            })
        )
        )
        .pipe(gulp.dest(publicDir + '/img'));
});

gulp.task('copy:fontawesome', function () {
    return gulp.src([
        'node_modules/@fortawesome/fontawesome-free/webfonts/**',
    ], { base: 'node_modules/@fortawesome/fontawesome-free/webfonts/' })
        .pipe(gulp.dest('src/fonts/'));
});

gulp.task('copy:files', function () {
    return gulp.src([
        'src/fonts/**/*',
    ], { base: 'src/' })
        .pipe(gulp.dest(publicDir))
        .pipe(browserSync.stream());
});

// gulp.task('copy:rootFiles', function () {
//   return gulp.src([
//     'src/.htaccess'
//   ],{base: 'src/'})
//     .pipe(gulp.dest(rootDir))
//     .pipe(browserSync.stream());
// });

gulp.task('copy:code', function () {
    return gulp.src([
        'src/data/**/*',
        'src/scripts/**/*',
    ], { base: 'src/' })
        .pipe(gulp.dest(publicDir))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync.init({
        //-- uncomment if you running this from a server and comment out 'server' parameter
        // proxy: "yourlocal.dev",
        server: {
            baseDir: publicDir + "/"
        },
        https: true
    });

    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('modernizr', 'scripts'));
    gulp.watch('src/**/*.(html|nunjucks|njk)', gulp.series('nunjucks'));
    gulp.watch('src/img/**/*.+(jpg|jpeg|gif|png|svg)', gulp.series('img'));
    gulp.watch(['src/fonts/**/*'], gulp.series('copy:files'));
    // gulp.watch(['src/.htaccess'], gdulp.series('copy:rootFiles'));
    gulp.watch(['src/data/**/*', 'src/scripts/**/*'], gulp.series('copy:code'));
    gulp.watch(['src/data/**/*'], gulp.series('nunjucks'));
});

gulp.task('build', gulp.series(
    'clean',
    // 'copy:rootFiles',
    'copy:fontawesome',
    'copy:files',
    'copy:code',
    'scripts:vendor',
    'modernizr',
    'scripts',
    'sass',
    'nunjucks',
    'img'));
gulp.task('default', gulp.series('build', 'serve'));
