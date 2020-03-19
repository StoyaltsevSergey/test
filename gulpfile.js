var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    browserSync = require('browser-sync').create();

// Default task
    gulp.task('default', function(done){
        console.log('work');
        done();
    });

// Sass компилируем, сжимаем, выгружаем
gulp.task('sass', function(done){
    gulp.src('catalog/view/theme/default/sass/**/*.scss')
    .pipe(sass())
    //autoprefixer
    .pipe(autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
    }))
    //Css compress
    .pipe(csso())
    //Выгружаем
    .pipe(gulp.dest('catalog/view/theme/default/css'))
    .pipe(browserSync.stream());
    done();
});

// Css concat and compress
gulp.task('css', function(done){
    gulp.src([
        'catalog/view/theme/default/stylesheet/*css',
        'catalog/view/theme/default/libs/fancybox/dist/jquery.fancybox.css',
    ])
    .pipe(csso())
    .pipe(concat('allstyles.min.css'))
    .pipe(gulp.dest('catalog/view/theme/default/css'))
    done();
})

// Js concat and compress
gulp.task('uglify', function(done){
    gulp.src([
        ('catalog/view/theme/default/libs/fancybox/dist/jquery.fancybox.js'),
        //('catalog/view/theme/default/libs/jquery/dist/jquery.js'),
    ])
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('catalog/view/theme/default/js'))
    done();
});

//Image min, jpg, png, svg
gulp.task('img-min', function(done){
  gulp.src('catalog/view/theme/default/image/**/*')
    .pipe(cache(imagemin({
      interlaced : true,
      progressive : true,
  })))
    .pipe(gulp.dest('catalog/view/theme/default/image'))
});

//Clear cache
gulp.task('clear', function(done){
    cache.clearAll();
    done();
})

//Browser-sync
// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
// Без локального сервера
//        server: {
//            baseDir: "app"
//        },
        proxy: "name project",
        browser: 'chrome',
        notify: false
    });
});

// Gulp watch
gulp.task('watch', function(done){
    gulp.watch('catalog/view/theme/default/sass/*.scss', gulp.series('sass'));
    gulp.watch("catalog/view/theme/default/template/**/*.tpl").on('change', browserSync.reload);
    done();
});

// Task for working
gulp.task('work', gulp.parallel('watch', 'sass', 'css', 'uglify', 'img-min', 'browser-sync'), function(done){
    done();
});
