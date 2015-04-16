/*
 * grunt-angular-i18n-templates
 * https://github.com/labertasch/angular-i18n-templates
 *
 * Copyright (c) 2015 Senol
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    angular_i18n_templates: {
      options: {
        locales: ["en", "de", "it", "fr", "ch_de", "ch_fr"],
        src: "src/**.html",
        dest: "build/templates.js",
        module: {
          name: "myApp",
          isNew: true
        },
        generateKey: function (locale, file) {
          return locale.replace("_", "/") + "/" + file.replace("test/src/", "");
        }
      },
      dev: {
        options: {
          htmlmin : {
            removeComments: true,
            collapseWhitespace: true
          }
        }
      }

    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');


  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'angular_i18n_templates', 'nodeunit']);

  grunt.registerTask('compile', ['angular_i18n_templates:dev']);
  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
