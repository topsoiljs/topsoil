//[X] Jade
//[X] Stylus
//[ ] JSX Compilation

var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var watch = require('gulp-watch');
 

gulp.task('jade', function () {
  var YOUR_LOCALS = {};
 
  gulp.src('./deploy/templates/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./deploy/client'))
});

gulp.task('stylus', function() {
  gulp.src('./deploy/stylus_styles/*.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./deploy/client/styles'));
});

gulp.task('ts', function () {
  var tsApp = gulp.src('server-typescript/*.ts')
                  .pipe(ts({
                      declarationFiles: true,
                      noExternalResolve: false,
                      module: "commonjs"
                  }));
    

  var tsServer = gulp.src('server-typescript/server/*.ts')
                     .pipe(ts({
                         declarationFiles: true,
                         noExternalResolve: false,
                         module: "commonjs"
                     }));

  return merge([
      tsApp.js.pipe(gulp.dest('deploy')),
      tsServer.js.pipe(gulp.dest('deploy/server'))
      ]);
});

gulp.task('tsw', function () {
  gulp.watch("**/*.ts", ["ts"])
});


gulp.task('build-all', ['jade', 'stylus', 'ts']);




