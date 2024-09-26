const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));  // 编译 SASS/SCSS
const cleanCSS = require('gulp-clean-css');  // 压缩 CSS
const uglify = require('gulp-uglify');  // 压缩 JS
const imagemin = require('gulp-imagemin');  // 压缩图片
const rename = require('gulp-rename');  // 重命名文件
const sourcemaps = require('gulp-sourcemaps');  // 生成 sourcemaps
const browserSync = require('browser-sync').create();  // 浏览器同步刷新
const del = require('del');  // 清理文件

// 文件路径
// const paths = {
//     styles: {
//         src: 'src/scss/**/*.scss',
//         dest: 'dist/css'
//     },
//     scripts: {
//         src: 'src/js/**/*.js',
//         dest: 'dist/js'
//     },
//     images: {
//         src: 'src/images/**/*',
//         dest: 'dist/images'
//     },
//     html: {
//         src: 'src/**/*.html',
//         dest: 'dist'
//     }
// };

const paths = {
    styles: {
        src: 'src/assets/less/**/*.less',  // 修改为你的 LESS 文件路径
        dest: 'dist/css'  // 编译后的 CSS 输出路径
    },
    scripts: {
        src: 'src/**/*.js',  // 匹配所有 JS 文件，视情况而定
        dest: 'dist/js'  // 压缩后的 JS 文件输出路径
    },
    images: {
        src: 'src/assets/images/**/*',  // 图片路径
        dest: 'dist/images'  // 优化后的图片输出路径
    },
    html: {
        src: 'public/**/*.html',  // HTML 文件源路径
        dest: 'dist'  // HTML 文件输出路径
    }
};

// 清理 dist 文件夹
function clean() {
    return del(['dist']);
}

// 编译 SASS -> CSS，压缩并生成 sourcemaps
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())  // 初始化 sourcemaps
        .pipe(sass().on('error', sass.logError))  // 编译 SASS/SCSS
        .pipe(cleanCSS())  // 压缩 CSS
        .pipe(rename({ suffix: '.min' }))  // 重命名为 *.min.css
        .pipe(sourcemaps.write('./'))  // 写入 sourcemaps
        .pipe(gulp.dest(paths.styles.dest))  // 输出到 dist/css
        .pipe(browserSync.stream());  // 自动刷新浏览器
}

// 压缩 JavaScript 并生成 sourcemaps
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())  // 初始化 sourcemaps
        .pipe(uglify())  // 压缩 JS
        .pipe(rename({ suffix: '.min' }))  // 重命名为 *.min.js
        .pipe(sourcemaps.write('./'))  // 写入 sourcemaps
        .pipe(gulp.dest(paths.scripts.dest))  // 输出到 dist/js
        .pipe(browserSync.stream());  // 自动刷新浏览器
}

// 压缩图片
function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())  // 优化图片
        .pipe(gulp.dest(paths.images.dest));  // 输出到 dist/images
}

// 复制 HTML 文件到 dist
function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// 监视文件变化，自动刷新浏览器
function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './dist'  // 设置根目录为 dist
        }
    });
    gulp.watch(paths.styles.src, styles);  // 监视 SCSS 文件
    gulp.watch(paths.scripts.src, scripts);  // 监视 JS 文件
    gulp.watch(paths.images.src, images);  // 监视图片
    gulp.watch(paths.html.src, html);  // 监视 HTML 文件
}

// 定义任务
const build = gulp.series(clean, gulp.parallel(styles, scripts, images, html));  // 顺序执行任务

// 导出任务
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.html = html;
exports.watch = gulp.series(build, watchFiles);  // 默认任务，构建后开始监视文件
exports.default = build;
