var gulp = require('gulp');
var minifyCss = require("gulp-minify-css");//css压缩
var uglify = require('gulp-uglify');//js压缩
var imagemin = require('gulp-imagemin');//图片压缩
var browserSync = require('browser-sync');//自动刷新
var reload = browserSync.reload;//自动刷新方法
var jspmin = require('gulp-htmlmin');//html压缩


gulp.task('css-min',  function() {
		return gulp.src(['css/*.css'],{base:'css'})
    .pipe(minifyCss())
    .pipe(gulp.dest('css-min'));
});

gulp.task('js-min',  function() {
		return gulp.src(['js/*.js'],{base:'js'})
    .pipe(uglify())
    .pipe(gulp.dest('js-min'));
});

gulp.task('img-min',  function() {
		return gulp.src(['src/img/*/*'],{base:'src'})
    .pipe(imagemin())
    .pipe(gulp.dest('src-min'));
});

gulp.task('html-min', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    return gulp.src(['build/*.html','build/*/*.html'],{base:'build'})
    .pipe(jspmin(options))
    .pipe(gulp.dest('build-min'));
});

gulp.task('watchserver',function(){
    browserSync.init({
        proxy:'http://localhost:63342/drag/build/drag.html',
        port:63342
    });
		gulp.watch([
				'build/drag.html','src/css/drag.css','src/js/drag.js'
		]).on('change',reload);
});

gulp.task('reloadpage',['watchserver']);
//gulp.task('gitee',['css-min','js-min','img-min','html-min']);