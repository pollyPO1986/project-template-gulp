// gulp plugins
const gulp = require('gulp');
// -可以載入我們已安裝好的以 gulp- 開頭的 gulp 套件，用 $ 字號替代
const $ = require('gulp-load-plugins')();
const gulpSequence = require('gulp-sequence');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const minimist = require('minimist');

//- 開發環境切換
/**
 * switch gulp --env production
 */
const envOption = {
  string: 'env',
  default: { env: 'develop' }
};

const options = minimist(process.argv.slice(2), envOption);

//Clean Task (在完成後，拿來清除之前開發中新刪修所編譯出的檔案，重新再把新的編譯出來做最後final給後端)
gulp.task('clean', function() {
  return gulp.src(['./build'], { read: false }).pipe($.clean());
});

//Server Task
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './build'
    },
    reloadDelay: 2000
  });
});

// Pug Task
gulp.task('pug', function() {
  gulp
    .src('./source/**/!(_)*.pug')
    .pipe($.plumber()) //- 放在 Task src 的後方，作為第一個 pipe； 主要用意是防止編譯出錯後中斷 Gulp
    // .pipe($.changed('build', {
    // 	extension: '.html'
    // }))
    .pipe(
      $.pug({
        pretty: true
      })
    )
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream()) //- 要在輸出之後
    .pipe(
      $.notify({
        message: 'pug task complete'
      })
    );
});

// Sass Task
gulp.task('sass', function() {
  return (
    gulp
      .src('./source/scss/**/*.scss')
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe(
        $.sass({
          outputStyle: 'compact'
          // includePaths: ['./vendors/bootstrap-sass/assets/stylesheets/']
        }).on('error', $.sass.logError)
      )
      //已編譯完成CSS
      .pipe($.postcss([autoprefixer()]))
      .pipe($.concat('style.css'))
      .pipe($.if(options.env === 'production', $.postcss([cssnano()])))
      .pipe($.sourcemaps.write('.')) //- sourcemaps 要在輸出之前
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream()) //- 要在輸出之後
      .pipe(
        $.notify({
          message: 'Sass task complete'
        })
      )
  );
});

//Font Task
gulp.task('fonts', function() {
  return gulp
    .src(['./vendors/bootstrap-sass/assets/fonts/bootstrap/*', './source/fonts/*'])
    .pipe(gulp.dest('./build/fonts'))
    .pipe(
      $.notify({
        message: 'fonts task complete'
      })
    );
});

// Javascript, ES6, ES7
gulp.task('babel', () =>
  gulp
    .src('./source/js/*.js')
    .pipe($.sourcemaps.init())
    .pipe(
      $.babel({
        presets: ['@babel/env']
      })
    )
    .pipe($.concat('style.js'))
    .pipe(
      $.if(
        options.env === 'production',
        $.uglify({
          compress: {
            drop_console: true //- 壓縮時直接移除 console
          }
        })
      )
    )
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./build/js')) // 最小化後JS目錄
    .pipe(browserSync.stream()) //要在輸出之後
    .pipe(
      $.notify({
        message: 'Scripts task complete'
      })
    )
);

//Script plugin Task
gulp.task('plugin', function() {
  return gulp
    .src('./source/js/plugin/*.js')
    .pipe(gulp.dest('./build/js'))
    .pipe(
      $.notify({
        message: 'Plugin task complete'
      })
    );
});

//Images Task
gulp.task('images', function() {
  return gulp
    .src('./source/images/**/*')
    .pipe($.if(options.dev === 'production', $.imagemin())) //因為很花時間，所以在開發時先不壓縮圖片
    .pipe(gulp.dest('./build/images'));
});

// Watch Task
gulp.task('watch', function() {
  gulp.watch('./source/**/*.pug', ['pug']);
  gulp.watch('./source/scss/**/*.scss', ['sass']);
  gulp.watch('./source/js/*.js', ['babel']);
  gulp.watch('./source/js/plugin/*.js', ['plugin']);
});

// Sequence Task (發布時使用的流程)
/**
 * gulp public --env production
 */
gulp.task('public', gulpSequence('clean', 'pug', 'sass', 'fonts', 'babel', 'plugin', 'images'));

// 一般開發時使用的流程
gulp.task('default', ['pug', 'sass', 'fonts', 'babel', 'plugin', 'images', 'browser-sync', 'watch']);
