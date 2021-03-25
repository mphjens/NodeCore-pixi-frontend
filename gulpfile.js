'use strict'

const gulp = require('gulp');
const argv = require('minimist')(process.argv.slice(2));
const gulpTs = require('gulp-typescript');
const gulpTslint = require('gulp-tslint');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('tslint');
const del = require('del');
const path = require('path');
const merge = require('merge2');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const nodeExternals = require('webpack-node-externals');

const appProject = gulpTs.createProject('tsconfig.json');
const typeCheck = tslint.Linter.createProgram('tsconfig.json');

gulp.task('lint', () => merge([
	gulp.src('./src/**/*.ts')
		.pipe(gulpTslint({
			configuration: 'tslint.json',
			formatter: 'prose',
			program: typeCheck
		}))
		.pipe(gulpTslint.report()),
	gulp.src('./app/**/*.ts')
		.pipe(gulpTslint({
			configuration: 'tslint.json',
			formatter: 'prose',
			program: typeCheck
		}))
		.pipe(gulpTslint.report())
]));

gulp.task('build', () => {
	del.sync(['./build/**/*.*']); //Clear the build folder

	//electron-src contains the electron entry-point (create's a window ect.)
	gulp.src('./electron-src/**/*.js')
		.pipe(gulp.dest('build/'));
	gulp.src('./electron-src/**/*.json')
		.pipe(gulp.dest('build/'));
	gulp.src(['./electron-src/**/*.png'])
		.pipe(gulp.dest('build/'));
	gulp.src('./electron-src/**/*.ttf')
		.pipe(gulp.dest('build/'));


	// gulp.src(['./app/**/*.*', '!./app/assets/**/**.*', '!./app/**/*.ts'])
	// 	.pipe(gulp.dest('./build/app/'));
	
	// //copy assets folder to build
	gulp.src('./app/assets/**/*.*')
		.pipe(gulp.dest('build/app/assets/'));
	
	//Copy container html and css files
	gulp.src(['./app/index.html', './app/app.css'])
		.pipe(gulp.dest('build/app'));
	
	const appCompile = gulp.src('./electron-src/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(appProject());

	const externals = [];
	if (!argv.web) {
		externals.push(nodeExternals());
	}
	
	//Compile stuff in ./app/, this folder contains our web app
	const renderCompile = gulp.src('./app/main.ts')
    	.pipe(gulpWebpack({
			watch: argv.watch ? true : false,
			mode: argv.dev ? "development" : "production",
			module: {
				rules: [
					{
						loader: 'ts-loader',
						exclude: [/node_modules/, /src/]
					},
				]
			},
			resolve: {
				modules: ['node_modules', 'app'],
				extensions: ['.tsx', '.ts', '.js']
			},
			output: {
				filename: 'app.js'
			},
			externals: externals,
			target: argv.web ? 'web' : 'electron-renderer',
			devtool: 'inline-source-map'
		}, webpack))

	return merge([
		appCompile.js
			.pipe(sourcemaps.write({
				sourceRoot: file => {
					return path.relative(path.join(file.cwd, file.path), file.base);
				}
			}))
			.pipe(gulp.dest('build/')),
		renderCompile
			.pipe(gulp.dest('build/app/'))
	]);
});