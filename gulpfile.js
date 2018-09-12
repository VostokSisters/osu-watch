let gulp = require('gulp');
let sass = require('gulp-sass');
let pug = require('gulp-pug');
let cleanCSS = require('gulp-clean-css');
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let changed = require('gulp-changed');
let rename = require("gulp-rename");
let addsrc = require('gulp-add-src');
let browserSync = require('browser-sync').create();
let plumber = require('gulp-plumber');
let uglify = require('gulp-uglify');

let devFolder = '_dev';

gulp.task('default', ['server', 'watch'], () => {
});

gulp.task('watch', () => {
    gulp.watch(devFolder + '/pug/**/*.pug', ['pug']);
    gulp.watch(devFolder + '/sass/**/*.sass', ['sass']);
    gulp.watch([
        devFolder + '/js/src/**',
    ], ['js']);

    gulp.watch([
        '*.html',
        'assets/**',
    ]).on('change', browserSync.reload);
});

gulp.task('server', () => {
    browserSync.init({
        server: "./"
    });
});

gulp.task('sass', () => {
    return gulp.src(devFolder + '/sass/main.sass')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('assets/css/'));
});

gulp.task('pug', () => {
    return gulp.src(devFolder + '/pug/index.pug')
        .pipe(plumber())
        .pipe(pug())
        .pipe(gulp.dest('./'));
});

gulp.task('js', () => {
    return gulp.src([
            devFolder + '/js/src/classes/**',
            devFolder + '/js/src/models/**',
            devFolder + '/js/src/views/**',
            devFolder + '/js/src/collections/**',
            devFolder + '/js/src/scripts/**',
        ])
        .pipe(changed(devFolder + '/js/*.js', {extension: '.js'}))
        .pipe(plumber())
        .pipe(babel({
            presets: ['env'],
        }))
        .pipe(addsrc.prepend(devFolder + '/js/libs/libs.min.js'))
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('assets/js/'));
});

gulp.task('js:libs',  () => {
    return gulp.src([
            devFolder + '/js/libs/src/jquery.js',
            devFolder + '/js/libs/src/underscore.js',
            devFolder + '/js/libs/src/backbone.js',
            devFolder + '/js/libs/src/jquery.timeago.js',
        ])
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest(devFolder + '/js/libs/'));
});
