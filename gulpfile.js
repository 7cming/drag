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

gulp.task('reloadpage',['watchserver']);