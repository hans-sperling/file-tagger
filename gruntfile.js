module.exports = function(grunt) {
    'use strict';

    // ----------------------------------------------------------------------------------------------------------- Grunt

    grunt.initConfig({
        pkg    : grunt.file.readJSON('package.json'),
        sass : {
            options: {
                style : 'expanded'
            },
            compileScssToCss : {
                files : {
                    'client/css/layout.css' : 'client/scss/layout.scss'
                }
            }
        },
        watch : {
            sass : {
                files : ['client/scss/**/*.scss'],
                tasks : ['sass']
            }
        }
    });

    // ----------------------------------------------------------------------------------------------- Plugins

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // ------------------------------------------------------------------------------------------------- Tasks

    grunt.registerTask('default', ['sass']);
    grunt.registerTask('watch', ['watch']);
};
