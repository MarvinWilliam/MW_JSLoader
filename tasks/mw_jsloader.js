/*
 * mw-jsloader
 *
 *
 * Copyright (c) 2016 Marvin William
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  grunt.registerTask('mw_jsloader', function () {
    var options         = this.options() || {
            dist: 'index.html',
            separator: ',',
            dataoptionname: '',
            mainscriptname: '',
            scriptid: 'mw_jsloader'
          },
        //Jsloader full scripts block
        regex_all       = /(<!--\s*lazyloader\s*([^\s]+)\s*-->)([\s\S\w]+)(<!--\s*endbuild\s*-->)/g,
        //Jsloader header and dest file name
        regex_build     = /<!--\s*lazyloader\s*([^\s]+)\s*-->/,
        //Jsloader footer
        regex_endbuild  = /<!--\s*endbuild\s*-->/,
        //Each script of jsloader
        regex_script    = /(<script .*?><\/script>)(\S|\s).*?/gi,
        //Each script src of jsloader
        regex_scriptsrc = /['"]([^'"]+\.js)['"],?/gi,
        //Dest script tag template
        destscript      = '<script src="{{destscriptsrc}}" id="{{scriptid}}" data-{{dataoptionname}}="{{destscripts}}" data-{{maindataoptionname}}="{{maindestscripts}}"></script>';

    if (!grunt.file.exists(options.dist)) {
      grunt.log.warn('Source file "' + options.dist + '" not found.');
      return;
    }

    var htmlcontent        = grunt.file.read(options.dist),
        jsloadercontext    = '',
        jsloaderconfig     = [],
        destscriptsrc      = '',
        destscriptname     = '',
        maindestscriptname = '',
        scripts            = [];

    if (!htmlcontent) {
      grunt.log.warn('There is no content of ' + options.dist + '.');
      return;
    }

    grunt.verbose.writeln('Html content get.');
    jsloadercontext = htmlcontent.match(regex_all).join('');

    if (!jsloadercontext) {
      grunt.log.warn('There is no jsloadercontent of ' + options.dist + '.');
      return;
    }

    jsloaderconfig = jsloadercontext.match(regex_build);
    grunt.verbose.writeln('JSLoader config get.');

    if (jsloaderconfig.length < 2) {
      grunt.log.warn('Jsloader config of ' + options.dist + ' is null.');
      return;
    }

    destscriptname = jsloaderconfig[jsloaderconfig.length - 1];
    options.dataoptionname = options.dataoptionname ? options.dataoptionname : destscriptname;
    scripts = jsloadercontext.match(regex_scriptsrc);

    function destscriptsrcs() {
      return scripts.map(function (item) {
        var result = item.replace(/"/g, '');
        if (result.indexOf(destscriptname) > -1) {
          destscriptsrc = result;
          return '';
        }
        if (result.indexOf(options.mainscriptname) > -1) {
          maindestscriptname = result;
          return '';
        }
        return encodeURIComponent(result);
      }).reduce(function (prev, cur) {
        if (cur) {
          return prev + options.separator + cur;
        } else {
          return prev;
        }
      });
    }

    function getContent() {
      var result = destscript;

      result = result.replace(/\{\{destscripts\}\}/, destscriptsrcs())
                     .replace(/\{\{destscriptsrc\}\}/, destscriptsrc)
                     .replace(/\{\{scriptid\}\}/, options.scriptid)
                     .replace(/\{\{dataoptionname\}\}/, options.dataoptionname)
                     .replace(/\{\{maindataoptionname\}\}/, options.dataoptionname + '_main')
                     .replace(/\{\{maindestscripts\}\}/, encodeURIComponent(maindestscriptname));

      grunt.verbose.writeln('Ready to replace content.');

      return htmlcontent.replace(regex_all, result);
    }

    grunt.file.write(options.dist, getContent());

    grunt.verbose.writeln('JSLoader task done.');
  });

};
