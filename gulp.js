/* eslint-disable no-mixed-spaces-and-tabs */
import gulp from 'gulp'
import sass from 'gulp-sass'
import cleanCSS from 'gulp-clean-css'
import browserSyncLib from 'browser-sync'
import browserSync from 'browser-sync';

require("dotenv").config();
const PORT = process.env.PORT || 8888

browserSync = browserSyncLib.create()

gulp.task("sass", function() {
	return gulp.src("./dev/sass/**/*.scss")
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(cleanCSS())
		.pipe(gulp.dest("public/dist"))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task("watch", function() {
	browserSync.init({
		proxy: `localhost:${PORT}`
	});

	gulp.watch("./dev/sass/**/*.scss", gulp.series("sass"));
	gulp.watch("views/**/*.hbs", browserSync.reload);
	gulp.watch("public/js/**/*.js", browserSync.reload);
}); 