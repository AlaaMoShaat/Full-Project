var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    pug = require('gulp-pug'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    ftp = require('vinyl-ftp'),
    gutil = require('gulp-util'),
    minify = require('gulp-minify');

gulp.task('html', function() {
  return gulp.src('stage/html/*.pug').pipe(pug({
    pretty: true
  })).pipe(gulp.dest('dist')).pipe(livereload())
});

gulp.task('css', function() {
  return gulp.src(['stage/css/**/*.css', 'stage/css/**/*.scss'])
          .pipe(sourcemaps.init())
          .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
          .pipe(autoprefixer())
          .pipe(concat('main.css'))
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('dist/css'))
          .pipe(livereload())
})

gulp.task('js', function() {
  return gulp.src('stage/js/*.js')
          .pipe(concat('main.js'))
          .pipe(minify())
          .pipe(gulp.dest('dist/js'))
          .pipe(livereload())
})

gulp.task('deploy', function() {
  var conn = ftp.create({
    host: 'alaa.net',
    user: 'AlaaShaat',
    password: 'alaa123',
    parallel: 10,
    log: gutil.log,
  });

  return gulp.src(['dist/**/*.*'], {base: '.', buffer: false})
          .pipe(conn.newer('/public_html'))
          .pipe(conn.dest('/public_html'))
          .pipe(livereload());
  
})



gulp.task('watch', function() {
    require('./server.js');
    livereload.listen();
    gulp.watch('stage/html/**/*.pug', gulp.series('html'));
    gulp.watch(['stage/css/**/*.css', 'stage/css/**/*.scss'], gulp.series('css'));
    gulp.watch('stage/js/*.js', gulp.series('js'));
    // gulp.watch('dist/**/*.*', gulp.parallel('deploy'))
})




