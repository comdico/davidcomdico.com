var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    // breakpoint = require('breakpoint-sass').includePaths,
    bourbon = require("node-bourbon").includePaths,
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    handlebars = require ('gulp-compile-handlebars'),
    newer = require('gulp-newer'),
    rename = require ('gulp-rename'),
    browsersync = require ('browser-sync');
    reload = browsersync.reload;
    // webserver = require('gulp-webserver'),
    astro = require('./src/data/astro.json');


var prefixerOptions = {
  browsers: ['last 4 versions']
};

var paths = {
    scss: 'src/sass/*.scss',
    sassInputFiles: ['src/sass/**/*.scss'],
    htmlInputFiles: ['src/templates/**/*.hbs'],
    cssOutputFolder: 'public/css/',
    imgInputFiles: ['src/img/*.*'],
    imgOutputFiles: 'public/img/',
    jsOutputFolder: 'public/js/'
};

var dest = 'public/';

var sassOptions = {
  outputStyle: 'expanded', //expanded or compressed
  includePaths: [
            './bower_components/susy/sass',
            './bower_components/susy/lib',
            './bower_components/susy/sass/susy',
            // require('breakpoint-sass').includePaths,
            './bower_components/breakpoint-sass/stylesheets',
            require('node-bourbon').includePaths
        ],
  sourcemap: false
};

var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin.error.bold + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if(error.fileName)
      errorString += ' in ' + error.fileName;

  if(error.lineNumber)
      errorString += ' on line ' + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
}

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};

var syncOpts = {
  server: {
    baseDir: dest,
    index: 'index.html'
  },
  open: false,
  notify: true
};


// gulp.task('js', function() {
//   return gulp.src('builds/sassEssentials/js/myscript.js')
//     .pipe(jshint('./.jshintrc'))
//     .pipe(jshint.reporter('jshint-stylish'));
// });

gulp.task('sass', function () {
    return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(plumber({errorHandler: onError}))
    .pipe(prefix(prefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.cssOutputFolder))
    .pipe(reload({stream:true}))
});

//not being used in this project - single page website
gulp.task('templates', function(){
    var data = {
      year: new Date().getFullYear(),
      astromenu: astro.astroItems
    };

    var options = {
      batch: ['src/templates/partials']
    }

    return gulp.src(['src/templates/**/*.hbs', '!src/templates/partials/**/*.hbs'])
    .pipe(handlebars(data, options))
    .pipe(rename (function (path) {
      path.extname = '.html'
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(reload({stream:true}));
});

gulp.task('watch', function() {
  gulp.watch(paths.sassInputFiles, ['sass']);
  gulp.watch(paths.htmlInputFiles, ['templates']);
});

//manage images
gulp.task('images', function () {
  return gulp.src(paths.imgInputFiles)
  .pipe(newer(paths.imgOutputFiles))
  .pipe(imagemin())
  .pipe(gulp.dest(paths.imgOutputFiles));
});

gulp.task('browsersync', function() {
  browsersync(syncOpts);

});

// gulp.task('webserver', function() {
//     gulp.src('public/')
//         .pipe(webserver({
//             livereload: true,
//             open: true,
//             host: '0.0.0.0'
//         }));
// });

gulp.task('default', ['sass', 'watch', 'images', 'browsersync']);
