import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import less from 'gulp-less';


const browserSyncInstance = browserSync.create();

const paths = {
    styles: {
        src: 'src/assets/less/**/*.less',  // 修改为你的 LESS 文件路径
        dest: 'dist/css'
    },
    scripts: {
        src: 'src/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/assets/images/**/*',
        dest: 'dist/images'
    },
    html: {
        src: 'public/**/*.html',
        dest: 'dist'
    }
};

// 清理 dist 文件夹
function clean() {
    return deleteAsync(['dist']);
}

// 编译 LESS -> CSS，压缩并生成 sourcemaps
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(less())  // 编译 LESS
        .on('error', console.error.bind(console))  // 捕获并打印 LESS 错误
        .pipe(cleanCSS())  // 压缩 CSS
        .pipe(rename({ suffix: '.min' }))  // 重命名为 *.min.css
        .pipe(sourcemaps.write('./'))  // 写入 sourcemaps
        .pipe(gulp.dest(paths.styles.dest))  // 输出到 dist/css
        .pipe(browserSync.stream());  // 自动刷新浏览器
}

// 压缩 JavaScript 并生成 sourcemaps
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSyncInstance.stream());
}

// 压缩图片
function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
}

// 复制 HTML 文件到 dist
function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSyncInstance.stream());
}

// 监视文件变化，自动刷新浏览器
function watchFiles() {
    browserSyncInstance.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.html.src, html);
}

// 定义任务
const build = gulp.series(clean, gulp.parallel(styles, scripts, images, html));

// 导出任务
export { clean, styles, scripts, images, html };
export const watch = gulp.series(build, watchFiles);
export default build;
