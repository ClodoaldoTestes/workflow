const gulp = require("gulp");

const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const source = require("vinyl-source-stream");
const babelify = require("babelify");

const sass = require("gulp-sass");
const prefix = require("gulp-autoprefixer");
const rename = require("gulp-rename");

const browserSync = require('browser-sync').create();

const config = {
	main_sass: './src/sass/style.sass',
	files_sass: './src/sass/*.sass',
	main_js: './src/js/index.js',
	files_js: './src/js/*.js',
	files_html: './*.html'
}

gulp.task('serve', function(){
	 browserSync.init({
      server: {
          baseDir: "./"
      }
   });
})

gulp.task('sass', function(){
	return gulp.src(config.main_sass)
		.pipe(sass({outputStyle: "compressed"}))
		.pipe(prefix({browsers: ['last 2 versions']}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
});

gulp.task('js', function(){
	return browserify({
		entries: config.main_js,
		debug: true
	})
	.transform(babelify,{presets: ["@babel/preset-env"]})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
	gulp.watch(config.files_js, ['js']);
	gulp.watch(config.files_sass, ['sass']);
	gulp.watch([config.files_html, config.files_js]).on('change', browserSync.reload);
});

gulp.task('default', ['serve','js','sass','watch']);