var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');
var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var watch = require('gulp-watch');
var react = require('gulp-react');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var mocha = require('gulp-mocha');
var glob = require('glob');
var install = require('gulp-install');

gulp.task('jade', function () {
  var YOUR_LOCALS = {};

  gulp.src('./client/templates/*.jade')
      .pipe(plumber())
      .pipe(jade({
        locals: YOUR_LOCALS
      }))
      .pipe(gulp.dest('./deploy/client'))
});

gulp.task('stylus', function() {
  gulp.src('./client/**/*.styl')
      .pipe(plumber())
      .pipe(stylus({
        compress: true
      }))
      .pipe(concat('main.css'))
      .pipe(gulp.dest('./deploy/client'));
});

gulp.task('ts', function () {
  var tsApp = gulp.src('server-typescript/**/*.ts')
                  .pipe(plumber())
                  .pipe(ts({
                      declarationFiles: true,
                      noExternalResolve: false,
                      module: "commonjs"
                  }));


  var tsServer = gulp.src('server-typescript/server/**/*.ts')
                     .pipe(plumber())
                     .pipe(ts({
                         declarationFiles: true,
                         noExternalResolve: false,
                         module: "commonjs"
                     }));

    var processAPI = gulp.src('server-typescript/server/processAPIs/**/*.ts')
        .pipe(plumber())
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: false,
            module: "commonjs"
        }));

    var utility = gulp.src('server-typescript/server/utility/**/*.ts')
        .pipe(plumber())
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: false,
            module: "commonjs"
        }));

    var processAPI = gulp.src('server-typescript/server/stateAPI/**/*.ts')
        .pipe(ts({
            declarationFiles: true,
            noExternalResolve: false,
            module: "commonjs"
        }));

  return merge([
      tsApp.js.pipe(gulp.dest('deploy')),
      tsServer.js.pipe(gulp.dest('deploy/server')),
      processAPI.js.pipe(gulp.dest('deploy/server/processAPIs')),
      utility.js.pipe(gulp.dest('deploy/server/utility'))
      ]);
});

gulp.task('install', function(){
  return merge([
      gulp.src('server-typescript/default_config.json').pipe(gulp.dest('deploy')),
      gulp.src(['./package.json', './bower.json', './.bowerrc'])
        .pipe(gulp.dest('deploy'))
        .pipe(install({production: true})),
      gulp.src('./topsoil').pipe(gulp.dest('deploy'))
    ])
});

gulp.task('jsx', function(){
   return gulp.src(['client/**/*.js', 'client/**/*.jsx'])
              .pipe(plumber())
              .pipe(react())
              .pipe(concat('client.js'))
              .pipe(gulp.dest('deploy/client'));
});

gulp.task('browserify', function() {
  //Taken from: https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-transforms.md
  var b = browserify({
    entries: ['./client/views/masterView.jsx',
              './client/views/super_grep/s_grep.jsx',
              './client/views/repl/repl_view.jsx',
              './client/views/git/git_view.jsx',
              './client/views/git/git_subview.jsx',
              './client/views/file_system/fs_view.jsx',
              './client/views/script_runner/processes_view.jsx'],
    debug: false,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
          .pipe(source('app.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
              // Add transformation tasks to the pipeline here.
              // .pipe(uglify())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('deploy/client'));
});

gulp.task('tsw', function () {
  gulp.watch("**/*.ts", ["ts"]);
});
gulp.task('jsx-w', function () {
  gulp.watch("**/*.jsx", ["jsx"])
});

gulp.task('test', function () {
    return gulp.src(['./test/fsAPITest.js','./test/gitAPITest.js'], {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('build-all', ['jade', 'stylus', 'ts', 'browserify', 'install']);

gulp.task('build-all-w', function(){
  gulp.watch(['server-typescript/**/*', 'client/**/*'], ['build-all']);
});






