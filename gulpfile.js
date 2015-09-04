var gulp = require("gulp"),
	browserSync = require("browser-sync").create(),
	imagemin = require("gulp-imagemin"),
	sass = require("gulp-sass"),
	jade = require("gulp-jade"),
	minifyCss = require("gulp-minify-css"),
	watch = require("gulp-watch"),
	spritesmith = require("gulp.spritesmith"),
	rename = require("gulp-rename"),
	cmq = require("gulp-combine-media-queries"),
	concat = require("gulp-concat"),
	uglify = require("gulp-uglify"),
	autoprefixer = require("gulp-autoprefixer"),
	size = require("gulp-filesize"),
	copy = require("gulp-copy"),
	plumber = require("gulp-plumber"),
	sourcemaps = require("gulp-sourcemaps"),
	runSequence = require("run-sequence"),
	gutil = require("gulp-util"),
	wiredep = require("wiredep").stream,
	del = require("del"),
	gulpif = require("gulp-if"),
	useref = require("gulp-useref"),
	filter = require("gulp-filter"),
	prettify = require("gulp-prettify"),
	ftp = require( "vinyl-ftp" );
	babel = require("gulp-babel");
/* ==============================

РАБОТА С ПРОЕКТОМ

============================== */


gulp.task("babel", function () {
  return gulp.src("src/js/common.js")
  	.pipe(plumber())
    .pipe(babel())
    .pipe(concat("app.js"))
    .pipe(gulp.dest("src/js"));
});

// gulp.task("react", function () {
//     return gulp.src("src/js/*.jsx")
//         .pipe(react())
//         .pipe(gulp.dest("src/js"));
// });

gulp.task("wiredep", function(){
	gulp.src("src/*.jade")
	.pipe(plumber())
	.pipe(wiredep({
		ignorePath: /^(\.\.\/)*\.\./
	}))
	.pipe(gulp.dest("src"));
});


gulp.task("browsersync", ["jade"], function() {
		browserSync.init({
				server: "src",
				notify: false,
				browser: "Chrome"
				});
});


gulp.task("jade", function() {
	return gulp.src("src/*.jade")
		.pipe(plumber())
		.pipe(jade())
		.pipe(prettify({indent_size: 2}))
		.pipe(gulp.dest("src"))
		.pipe(browserSync.reload({stream: true}));
});


gulp.task("sass", function () {
	gulp.src("src/sass/*.*")
		.pipe(sourcemaps.init())
		.pipe(sass({
		includePaths: require("node-bourbon").includePaths
	}).on("error", sass.logError))
	.pipe(rename({suffix: ".min"}))
	.pipe(autoprefixer({
		browsers: ["last 15 versions"],
		cascade: false
	}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest("src/css"))
	.pipe(browserSync.reload({stream: true}));
});


gulp.task("spritesmith", function () {
	var spriteData = gulp.src("src/img/sprites/*.png")
	.pipe(plumber())
	.pipe(spritesmith({
		imgName: "spritesheet.png",
		imgPath: "../img/spritesheet.png",
		cssName: "../sass/vendor/sprites.css",
		algorithm: "top-down",
		padding: 2
	}));
	return spriteData.pipe(gulp.dest("src/img"));
});


gulp.task("rename", function(){
	gulp.src("src/sass/vendor/sprites.css")
	.pipe(plumber())
	.pipe(rename("sprites.scss"))
	.pipe(gulp.dest("src/sass/vendor"));
});


gulp.task("watch", function(){
	gulp.watch("src/**/*.jade", ["jade"]);
	gulp.watch("bower.json", ["wiredep"]);
	gulp.watch("src/sass/*.*", ["sass"]);
	gulp.watch("src/js/*.*", ["babel"]).on("change", browserSync.reload);
	gulp.watch("src/img/sprites", ["sprite"]);
});

/* ==============================

СБОРКА ПРОЕКТА

============================== */

gulp.task("useref", function(){
	var assets = useref.assets();
	return gulp.src("src/*.html")
	.pipe(assets)
	.pipe(gulpif("*.js", uglify({options: {
                mangle: false
            }})))
	.pipe(gulpif("*.css", minifyCss({compatibility: "ie8"})))
	.pipe(assets.restore())
	.pipe(useref())
	.pipe(gulp.dest("dist"));
});

gulp.task("fonts", function(){
	gulp.src("src/fonts/*")
	.pipe(filter(["*.eot","*.svg","*.ttf","*.woff","*.woff2"]))
	.pipe(gulp.dest("dist/fonts"));

});


gulp.task("imagemin", function () {
		return gulp.src("src/img/**/*.*")
				.pipe(plumber())
				.pipe(imagemin({
						progressive: true,
						svgoPlugins: [{removeViewBox: false}]
				}))
				.pipe(gulp.dest("dist/img"));
});


gulp.task("clean", function() {
del.sync(["dist"], function (err, paths) {
		console.log("Deleted files/folders:\n", paths.join("\n"));
});
});


gulp.task("cmq", function () {
	gulp.src("src/css/*.css")
		.pipe(plumber())
		.pipe(cmq({
			log: true
		}))
		.pipe(gulp.dest("dist/css"));
});


gulp.task("copy", function(){
	gulp.src([
		"src/*.*",
		"!src/*.jade",
		"!src/index.html",
		"src/.htaccess"
]).pipe(gulp.dest("dist"));
});


/* ==============================

ТАСКИ

============================== */


gulp.task("default", ["browsersync","watch"], function () {
		return gutil.log("Gulp is running!");
	});

gulp.task("sprite", function(){
	runSequence("spritesmith", "rename", "sass");
});

gulp.task("dist", function(){
runSequence("clean", "useref", "imagemin", "fonts", "copy");
});
