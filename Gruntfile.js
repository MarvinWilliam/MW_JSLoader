/*
 * mw-jsloader
 *
 *
 * Copyright (c) 2016 Marvin William
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Configuration to be run (and then tested).
    mw_jsloader: {
      options: {
        dist: 'test/index.html',
        separator: ',',
        dataoptionname: 'jsloader',
        scriptid: 'jsloader'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['mw_jsloader', 'nodeunit']);

  grunt.registerTask('jsloader', function(){
    grunt.task.run(['mw_jsloader']);
    debugger
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
