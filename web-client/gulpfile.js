var gulp = require("gulp");
var gulpHeader = require('gulp-header')
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var pkg = require("./package.json");
var browserSync = require("browser-sync").create();
// Set the banner content

// Copy third party libraries from /node_modules into /vendor
// Minify CSS
gulp.task("css:minify", function() {
  return gulp
    .src(["./public/css/*.css", "!./public/css/*.min.css"])
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
});
// CSS
gulp.task("css", ["css:minify"]);

// Dev task
gulp.task("dev", ["css"], function() {
  gulp.watch("./public/css/*.css", ["css"]);
});
