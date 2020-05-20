import gulp from 'gulp'
import browserSyncLib from 'browser-sync'
import gulpLoadPlugins from 'gulp-load-plugins'

const plugins = gulpLoadPlugins(),
	browserSync = browserSyncLib.create()


require("dotenv").config();
const PORT = process.env.PORT || 8888

gulp.task("watch", function() {
	browserSync.init({
		proxy: `localhost:${PORT}`
	});

	gulp.watch("./dev-assets/sass/**/*.scss", gulp.task("compile-sass"))
	gulp.watch("./dev-assets/js/**/*.js", gulp.task("compile-js"))
	gulp.watch("views/**/*.hbs").on('change', browserSync.reload)
}); 

gulp.task("compile-sass", function() {
	return gulp.src("./dev-assets/sass/**/*.scss")
		.pipe(plugins.sass())
		.on("error", plugins.sass.logError)
		.pipe(plugins.cleanCss())
		.pipe(gulp.dest("static/dist"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('compile-js', function(done) {
	gulp.src('dev-assets/js/**/*.js')
		.pipe(plugins.plumber())
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.babel({
			presets: ['@babel/env']
		}))
	   	.pipe(plugins.uglify())
		.pipe(gulp.dest('static/dist'))
		   
	done()
 })

 exports.build = gulp.series(['compile-sass', 'compile-js']);