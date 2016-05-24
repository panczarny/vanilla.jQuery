module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			dist: {
				src: ['dist/**']
			}
		},

		/*****************************************************************/

		browserSync: {
			dev: {
				options: {
					server: {
						baseDir: "./"
					}
				},
				bsFiles: {
					src: ['*.css', '*.html', '*.js', '*.php']
				},
			},
		},

		/*****************************************************************/

		uglify: {
			options: {
				mangle: true
			},
			dist: {
				files: {
					'dist/vanilla.jquery.min.js' : ['vanilla.jquery.js']
				}
			}
		}
	});

	grunt.registerTask('default', ['dev']);

	/*
	** DEV
	**/
	grunt.registerTask('dev', [], function () {
		grunt.config.get('browserSync');
		grunt.loadNpmTasks('grunt-browser-sync'); 
		grunt.task.run('browserSync');
	}); 

	/*
	** DIST
	**/
	grunt.registerTask('dist', [], function () {
		grunt.config.get('clean');
		grunt.config.get('uglify');
		grunt.loadNpmTasks('grunt-contrib-clean'); 
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.task.run('clean:dist');
		grunt.task.run('uglify:dist');
	}); 

};