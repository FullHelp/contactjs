module.exports = function (grunt) {
    // require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                src: ['test/**/*.js']
            },
            options: {
                timeout: 30000,
            },
        },

        watch: {
            build: {
                files: ['src/**/*.js'],
                tasks: ['build']
            },
            test: {
                files: ['src/**/*.js', 'test/**/*.js'],
                tasks: ['test']
            }
        },

        webpack: require('./webpack.config.js')
    });

    grunt.registerTask('test', 'Run mocha tests', ['mochaTest']);
    grunt.registerTask('build', 'Run webpack and bundle the source', ['webpack']);
    // grunt.registerTask('version', 'Sync version info for a release', ['usebanner', 'package2bower']);
};
