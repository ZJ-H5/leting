var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
var moment = require('moment');
var zip = require('gulp-zip');
var ftp = require('gulp-ftp');
var proxy = require('http-proxy-middleware');
var babel = require("gulp-babel");
var es2015 = require("babel-preset-es2015");

var app = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/',
    zipPath: 'zip/'
};

gulp.task('lib', function () {
    gulp.src('bower_components/**/*.js')
        .pipe(gulp.dest(app.devPath + 'vendor'))
        .pipe(gulp.dest(app.prdPath + 'vendor'))
        .pipe($.connect.reload());
});
gulp.task('minifycss', function () {
    gulp.src('bower_components/**/*.css')
        .pipe(gulp.dest(app.devPath + 'css'))//输出到css目录
        .pipe(gulp.dest(app.prdPath + 'css'))//输出到css目录
        .pipe($.connect.reload());
});

gulp.task('html', function () {
    gulp.src(app.srcPath + '**/*.html')
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
})


gulp.task('json', function () {
    gulp.src(app.srcPath + 'data/**/*.json')
        .pipe(gulp.dest(app.devPath + 'data'))
        .pipe(gulp.dest(app.prdPath + 'data'))
        .pipe($.connect.reload());
});

gulp.task('less', function () {
    gulp.src(app.srcPath + 'style/index.less')
        .pipe($.plumber())
        .pipe($.less())
        .pipe(gulp.dest(app.devPath + 'css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(app.prdPath + 'css'))
        .pipe($.connect.reload());
});


gulp.task('js', function () {
    gulp.src(app.srcPath + 'script/**/*.js')
    // .pipe(babel({presets:[es2015]}))
        .pipe($.plumber())
        .pipe(gulp.dest(app.devPath + 'js'))
        .pipe($.uglify())
        .pipe(gulp.dest(app.prdPath + 'js'))
        .pipe($.connect.reload());
});
// .pipe(webpack({//babel编译import会转成require，webpack再包装以下代码让代码里支持require
//             output:{
//                 filename:"all.js",
//             },
//             stats:{
//                 colors:true
//             }
//         }))


gulp.task('image', function () {
    gulp.src(app.srcPath + 'image/**/*')
        .pipe($.plumber())
        .pipe(gulp.dest(app.devPath + 'image'))
        .pipe($.imagemin())
        .pipe(gulp.dest(app.prdPath + 'image'))
        .pipe($.connect.reload());
});

gulp.task('build', ['image', 'js', 'minifycss', 'less', 'lib', 'html', 'json']);

gulp.task('clean', function () {
    gulp.src([app.devPath, app.prdPath, app.zipPath])
        .pipe($.clean());
});

gulp.task('zip', function () {
    var timeStamp = moment().format("YYYY-MM-D_HH-mm-ss_");
    return gulp.src(app.prdPath + '**/*.*')
        .pipe(zip("dist_" + timeStamp + ".zip"))
        .pipe(gulp.dest(app.zipPath));
});

gulp.task('ftp', function () {
    gulp.src(app.prdPath + "**/*")
        .pipe(ftp({
            host: 'someHost',
            port: 8080,
            remotePath: "somePath/"
        }));
});

gulp.task('connect', ['build'], function () {
    $.connect.server({
        root: [app.devPath],
        livereload: false,
        port: 8010,
    //     // middleware: function (connect, opt) {
    //     //     return [
    //     //         proxy('/fs', {
    //     //             target: 'http://d3.cto.shovesoft.com',
    //     //             changeOrigin:true
    //     //         }),
    //     //         proxy('/product', {
    //     //             target: 'http://d3.cto.shovesoft.com',
    //     //             changeOrigin:true
    //     //         }),
    //     //         proxy('/bpauth', {
    //     //             target: 'http://d3.cto.shovesoft.com',
    //     //             changeOrigin:true
    //     //         })
    //     //     ]
    //     // }
    });
    open('http://localhost:8010');
    gulp.watch('bower_components/**/*.js', ['lib']);
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
    gulp.watch('bower_components/**/*.css', ['minifycss']);
    gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(app.srcPath + 'image/**/*', ['image']);
});

gulp.task('default', ['connect']);
