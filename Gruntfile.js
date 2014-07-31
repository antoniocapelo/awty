module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            scripts: {
                src: ['src/**.js']
            },

            tests: { // We can have more than one jshint task, this ones called `jshint:tests`
                src: 'tests/**.js'
            }
        },

        uglify: {
            scripts: {
                expand: true,
                cwd: 'src/',
                src: '**.js',
                dest: 'dist/',
                ext: '.min.js'
            }
        },

        watch: {
            scripts: {
                files: 'scripts/**.js',
                task: 'jshint:scripts'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'less']);
    grunt.registerTask('build', ['jshint', 'uglify']);

};