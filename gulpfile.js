const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
var postcss = require('gulp-postcss');
// flex box adapter
var flexadapter = require('postcss-flexadapter');
// postcss
var px2rem = require('postcss-px2rem');
// （用于压缩 CSS）
var cleanCSS = require('gulp-clean-css');
// （用于压缩 JS）
var uglify = require('gulp-uglify');
//重命名
var rename = require("gulp-rename");
// 文件版本号
var filever = require('gulp-version-filename');
// 合并
var concat = require('gulp-concat');
//语法检测
var jshint = require('gulp-jshint');
// hash 版本
var RevAll = require('gulp-rev-all');
// gulp rev MD5加密版本
var rev = require('gulp-rev');
var del = require('del');
var revCollector = require('gulp-rev-collector');
//base64转码
var base64 = require('gulp-base64');
// 构建前先删除dist文件里的旧版本
gulp.task('del',function () {
    del('./html/dist/*');
});
// 文件路径替换
gulp.task('replace', function() {
    gulp.src(['./html/dist/rev/**/*.json', './html/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./html/'));                     //- 替换后的文件输出的目录
});

//压缩css
gulp.task('minifycss', function() {
    return gulp.src('html/css/*.css')    //需要操作的文件
        .pipe(base64({
            maxImageSize: 8*1024, // bytes
        })) // base64转码
        .pipe(concat('bundle.css')) //合并所有css 到 main.css
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(cleanCSS({compatibility: 'ie7'}))   //执行压缩
        .pipe(gulp.dest('html/dist'))
        .pipe(rev())
        .pipe(gulp.dest('html/dist'))   //输出文件夹
        .pipe(rev.manifest())
        .pipe(gulp.dest('./html/dist/rev/css'));

});

//压缩,合并 js
gulp.task('minifyjs', function() {
    return gulp.src('html/js/*.js')      //需要操作的文件
        .pipe(concat('bundle.js'))    //合并所有js到main.js
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('html/dist'))
        .pipe(rev())
        .pipe(gulp.dest('html/dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./html/dist/rev/js'));  //输出

});
//语法检查
gulp.task('jshint', function () {
    return gulp.src('html/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
// 添加版本号
gulp.task('version', function () {
    return gulp.src(['html/css/index.css'])
        .pipe(filever())
        .pipe(gulp.dest('dist'));
});

// 压缩 css 文件
// 在命令行使用 gulp csscompress 启动此任务
gulp.task('csscompress', function () {
    // 1. 找到文件
    return gulp.src('html/css/*.css')
    // 2. 压缩文件
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('html/dist/css/'));
});
// 压缩 js 文件
gulp.task('jscompress', function () {
    // 1. 找到文件
    return gulp.src('src/app.js')
    // 2. 压缩文件
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('html', function () {
    var postcss_flexadapter = [flexadapter
    ];
    var processors = [px2rem({remUnit: 100})];
    return gulp.src('./html/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postcss_flexadapter))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./html/css'));
});
gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});
gulp.task('es6', () => {
    return gulp.src('src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build'))
});

gulp.task('default', ['es6', 'sass', 'html'], () => {
    gulp.watch('src/*.js', ['es6']);
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('./html/sass/*.scss', ['html'])
});