var gulp = require('gulp'),
    pipe = require('multipipe'),
    browserSync = require('browser-sync'),
    plugins = require('gulp-load-plugins')()
    ;


// Browser-sync task, only cares about compiled CSS
gulp.task('browser-sync', function() {
    browserSync.init(['src/styles/main.css', 'src/*.html', 'src/scripts/*.js'], {
        server: {
            baseDir: './src'
        }
    });
});

// Sass task, will run when any SCSS files change.
gulp.task('sass', function() {
    var combined = pipe(
        gulp.src('src/styles/main.scss'),
        plugins.sass({ style: 'expanded' }),
        plugins.autoprefixer(),
        gulp.dest('src/styles')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });
    return combined;
});

// Build task, runs jshint anf uglify and outputs to dist
gulp.task('build', function() {
    var combined = pipe(
        gulp.src('src/scripts/awty.js'),
        plugins.jshint(),
        plugins.jshint.reporter('jshint-stylish'),
        plugins.uglify(),
        plugins.rename('awty.min.js'),
        gulp.dest('dist')
    );
    combined.on('error', function(err) {
        console.warn(err.message);
    });
    return combined;
});


// Default task to be run with `gulp`
gulp.task('default', ['sass', 'browser-sync'], function() {
    gulp.watch('src/styles/*.scss', ['sass']);
});
