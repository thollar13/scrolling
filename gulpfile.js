var gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  watch = require('gulp-watch'),
  gulpLoadPlugins = require("gulp-load-plugins"),
  tasks = gulpLoadPlugins({scope: ["devDependencies"]}),
  gutil = require('gulp-util'),
  livereload = require('gulp-livereload'),
  cssGlobbing = require('gulp-css-globbing'),
  babel = require('gulp-babel'),
  eslint = require('gulp-eslint'),
  replace = require('gulp-replace'),
  del = require('del'),
  notify = tasks.notify;

  function getCwdFolderName(){
    var a = __dirname.split("/");
    return a[a.length - 1];
  }
  var config = {
    SITE_ROOT: "http://" + getCwdFolderName() + ".dev/"
  };
  console.log(config);

gulp.task('dist-sass', function () {
    gulp.src('./assets/src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(cssGlobbing())
      .pipe(sass({errLogToConsole: true, sourcemap: true}))
      .pipe(tasks.autoprefixer('last 2 versions', 'safari 6', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(sourcemaps.write({
        sourceMappingURLPrefix: config.SITE_ROOT + "assets/dist/css/",
        includeContent: false, sourceRoot: '../../src/scss'
      }))
      .pipe(gulp.dest('./assets/dist/css'))
      .pipe(tasks.rename({suffix: '.min'}))
      .pipe(tasks.cssmin())
    .pipe(gulp.dest('./assets/dist/css'))
    .pipe(livereload());
});

gulp.task('dist-js', function () {

  console.log("Building JavaScript.");
  gulp.src(['./assets/src/js/cookie.js', './assets/src/js/script.js'])
      .pipe(sourcemaps.init())
      .pipe(tasks.concat('./assets/dist/js/script.js'))
      .pipe(eslint({
        globals: {
          "jQuery": true,
          "window": true,
          "document": true
        }
      }))
      .pipe(babel())
      .pipe(gulp.dest('./'))
      .pipe(tasks.rename({suffix: '.min'}))
      .pipe(tasks.uglify())
      .pipe(eslint.format())
      .pipe(gulp.dest('./'))
      .pipe(sourcemaps.write('.'))
      .pipe(livereload())
      .on('error', function(message){
        console.log(message);
      });

});

gulp.task('dist-img', function(){
  return gulp.src(['assets/src/img/*.jpg', 'assets/src/img/*.png', 'assets/src/img/*.svg'])
    .pipe(tasks.newer('assets/dist/img'))
    .pipe(tasks.imagemin())
    .pipe(gulp.dest('assets/dist/img'));
});

gulp.task('version-update', function(){
  var date = new Date().toISOString();
  del(['inc/version.php']);
  return gulp.src(['inc/version.tmp.php'])
    .pipe(replace('PACKAGEVERSION', "'"+date+"'"))
    .pipe(tasks.rename({
      basename: 'version',
      extname: '.php'
    }))
    .pipe(gulp.dest('inc/'));
});

gulp.task('watch', function () {
  livereload.listen();
  watch('assets/src/**/*.js', function () {
    gulp.start('dist-js');
    gulp.start('version-update');
  });
  watch('assets/src/**/*.scss', function () {
    gulp.start('dist-sass');
    //gulp.start('dist-img');
    gulp.start('version-update');
  });
  watch('**/*.php', function(){
    console.log("Refreshing Page.");
    livereload.reload();
  });
});
