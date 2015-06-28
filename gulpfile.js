'use strict';

var gulp = require('gulp');
var del = require('del');


var path = require('path');


// Load plugins
var reactify = require('reactify');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),

    sourceFile = './client/app.js',

    destFolder = './dist',
    destFileName = 'app.js';

// Styles
gulp.task('styles', ['sass']);

gulp.task('sass', function() {
    return gulp.src(['client/styles/**/*.scss'])
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['client/bower_components']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

gulp.task('stylus', function() {
    return gulp.src(['client/styles/**/*.styl'])
        .pipe($.stylus())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});


var bundler = watchify(browserify({
    transform: reactify,
    entries: [sourceFile],
    debug: true,
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
}));

bundler.on('update', rebundle);
bundler.on('log', $.util.log);

function rebundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source(destFileName))
        .pipe(gulp.dest(destFolder))
}

// Scripts
gulp.task('scripts', rebundle);

gulp.task('buildScripts', function() {
    return browserify(sourceFile)
        .transform(reactify)
        .bundle()
        .pipe(source(destFileName))
        .pipe(gulp.dest('dist'));
});




// HTML
gulp.task('html', function() {
    return gulp.src('client/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')({
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }).concat('client/fonts/**/*'))
        .pipe(gulp.dest('dist/fonts'));
});

// Clean
gulp.task('clean', function(cb) {
    $.cache.clearAll();
    cb(del.sync(['dist/styles', 'dist']));
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function() {
    return gulp.src('./client/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('buildBundle', ['styles', 'buildScripts', 'bower'], function() {
    return gulp.src('./client/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src(['client/bower_components/**/*.js', 'client/bower_components/**/*.css'], {
            base: 'client/bower_components'
        })
        .pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('client/json/**/*.json', {
            base: 'client'
        })
        .pipe(gulp.dest('dist/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function() {
    return gulp.src(['client/*.txt', 'client/*.ico'])
        .pipe(gulp.dest('dist/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'fonts', 'bundle'], function() {

    // Watch .html files
    gulp.watch(['client/*.html'], ['html']);

    gulp.watch(['client/styles/**/*.scss'], ['styles']);

    
});

// Watch short hand
gulp.task('develop', ['watch'], new Function());
gulp.task('serve', ['watch'], new Function());

// Build
gulp.task('build', ['html', 'buildBundle', 'fonts', 'extras'], function() {
    gulp.src('dist/app.js')
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe(gulp.dest('dist'));
});

// Default task
gulp.task('default', ['clean', 'build', 'jest'  ]);
