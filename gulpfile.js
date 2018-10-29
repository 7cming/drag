var gulp = require('gulp');
var minifyCss = require("gulp-minify-css");//css压缩
var uglify = require('gulp-uglify');//js压缩
var imagemin = require('gulp-imagemin');//图片压缩
var browserSync = require('browser-sync');//自动刷新
var reload = browserSync.reload;//自动刷新方法
var jspmin = require('gulp-htmlmin');//html压缩


gulp.task('watchserver',function(){
    browserSync.init({
        proxy:'http://localhost:63342/drag/build/drag.html',
        port:63342
    });
		gulp.watch([
				'build/drag.html','src/css/drag.css','src/js/drag.js'
		]).on('change',reload);
});

gulp.task('css-min',  function() {
    return gulp.src(['src/css/*.css'],{base:'src'})
        .pipe(minifyCss())
        .pipe(gulp.dest('G:\\WebstormProjects\\drag-gitee\\src'));
});

gulp.task('js-min',  function() {
    return gulp.src(['src/js/*.js'],{base:'src'})
        .pipe(uglify())
        .pipe(gulp.dest('G:\\WebstormProjects\\drag-gitee\\src'));
});

// gulp.task('img-min',  function() {
//     return gulp.src(['src/img/*/*'],{base:'src'})
//         .pipe(imagemin())
//         .pipe(gulp.dest('src-min'));
// });

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
    return gulp.src(['build/*.html'],{base:'build'})
        .pipe(jspmin(options))
        .pipe(gulp.dest('G:\\WebstormProjects\\drag-gitee\\build'));
});
gulp.task('reloadpage',['watchserver']);
gulp.task('gitee',['css-min','js-min','html-min']);