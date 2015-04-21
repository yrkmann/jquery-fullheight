var $           = require('gulp-load-plugins')();
var gulp        = require('gulp');
var fs          = require('fs');

var pkg = require('./package.json');

var path = {
	src: './src/',
	dist: './dist/',
};

gulp.task('copy', function () {
	return gulp.src([path.src + pkg.name + '.js'])
		.pipe($.header(fs.readFileSync('./src/header.txt', 'utf8'), {pkg: pkg}))
		.pipe(gulp.dest(path.dist));
});

gulp.task('uglify', function () {
	return gulp.src([path.src + pkg.name + '.js'])
		.pipe($.header(fs.readFileSync('./src/header.min.txt', 'utf8'), {pkg: pkg}))
		.pipe($.sourcemaps.init())
		.pipe($.uglify({preserveComments: 'some'}))
		.pipe($.rename({
			suffix: '.min'
		}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(path.dist));
});

gulp.task('jshint', function () {
	return gulp.src([
		'./bower.json',
		'./gulpfile.js',
		path.src + '**/*.js'
	]).pipe($.jshint())
	.pipe($.jshint.reporter('jshint-stylish'))
	.pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function () {
	return gulp.src([
		'./gulpfile.js',
		path.src + '**/*.js'
	]).pipe($.jscs());
});

// Update bower, component, npm at once:
gulp.task('patch', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe($.bump({type: 'patch'}))
		.pipe(gulp.dest('./'));
});

// Update bower, component, npm at once:
gulp.task('feature', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe($.bump({type: 'minor'}))
		.pipe(gulp.dest('./'));
});

// Update bower, component, npm at once:
gulp.task('release', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe($.bump({type: 'major'}))
		.pipe(gulp.dest('./'));
});

gulp.task('tag', function () {
	return gulp.src('./package.json')
		.pipe($.tagVersion());
});

gulp.task('watch', function () {
	gulp.watch([path.src + '**/*.js'], ['scripts']);
	gulp.watch(['./bower.json'], ['build']);
});

gulp.task('scripts', ['jshint', 'jscs'], function () {
	gulp.start(['uglify', 'copy']);
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
