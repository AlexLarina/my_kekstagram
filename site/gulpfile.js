"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
/* -- минификация css -- */
var minify = require("gulp-csso");
var rename = require("gulp-rename");
/* -- -- */
/* -- минификация изображений -- */
var imagemin = require("gulp-imagemin");
/* -- -- */
/*-- изображения в формате webp--*/
var webp = require("gulp-webp");
/* -- -- */
/*-- svg спрайт--*/
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
/* -- -- */
/*-- posthtml --*/
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
/* -- -- */

gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    /* -- минификация css -- */
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    /* -- -- */
    .pipe(server.stream());
});

/* -- минификация изображений -- */
gulp.task("images", function () {
  return gulp.src("img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
]))
  .pipe(gulp.dest("img"));
});
/* -- -- */
/*-- изображения в формате webp --*/
gulp.task("webp", function () {
 return gulp.src("img/**/*.{png,jpg}")
 .pipe(webp({quality: 90}))
 .pipe(gulp.dest("img"));
});
/* -- -- */
/*-- svg спрайт --*/
gulp.task("sprite", function () {
  return gulp.src("img/icon-*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});
/* -- -- */
/*-- posthtml --*/
gulp.task("html", function () {
 return gulp.src("*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest("build"));
});
/* -- -- */
gulp.task("serve", ["style"], function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("less/**/*.less", ["style"]).on("change", server.reload);
  gulp.watch("*.html", ["html"]).on("change", server.reload);
  //gulp.watch("*.html").on("change", server.reload);
});
