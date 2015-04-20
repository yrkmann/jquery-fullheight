var $           = require('gulp-load-plugins')();
var argv        = require('yargs').argv;
var gulp        = require('gulp');

var path = {
	src: 'src/',
	dist: 'dist/',
};

gulp.task('scripts', ['jshint', 'jscs'], function () {
	return gulp.src([path.src + '**/*.js'])
		.pipe($.sourcemaps.init())
		.pipe($.uglify())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('jshint', function () {
	return gulp.src([
		'bower.json',
		'gulpfile.js',
		path.src + '**/*.js'
	]).pipe($.jshint())
	.pipe($.jshint.reporter('jshint-stylish'))
	.pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function () {
	return gulp.src([
		'gulpfile.js',
		path.src + '**/*.js'
	]).pipe($.jscs());
});

gulp.task('watch', function () {
	gulp.watch([path.src + '**/*.js'], ['scripts']);
	gulp.watch(['bower.json'], ['build']);
});

gulp.task('clean', function () {
	require('del')([path.dist]);
});

gulp.task('test', function () {
	gulp.start(['jshint', 'jscs']);
});

gulp.task('build', function () {
	gulp.start('scripts');
});

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});
