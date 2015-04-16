/*
 * grunt-angular-i18n-templates
 * https://github.com/labertasch/angular-i18n-templates
 *
 * Copyright (c) 2015 Senol Tas <input@senol.io>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var fs = require("fs");
  var path = require("path");
  var _ = require('lodash');
  var ejs = require("ejs");
  var minify = require('html-minifier').minify;


  function generateKey(locale, file) {
    return locale + "/" + file;
  }


  grunt.registerMultiTask('angular_i18n_templates', 'This plugin precompiles html files/templates and put them into angular template cache. It is also reading locale information and generating localized templates', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      module : {
        name: "myApp",
        isNew: true
      },
      src: "test/src/**/*.html",
      locales: ["en"],
      htmlmin : {},
      "generateKey": generateKey
    });

    var templates = 0;
    var languages = 0;

    var locales = {}; // implement locale cache eventually
    var defaultLocale = options.locales[0];
    var defaultLoc;

    var outputTemplate  = "var myApp = angular.module('<%=module.name%>'<%if (module.isNew) { %>, []<%}%>);\n";
        outputTemplate += "myApp.run(function($templateCache) {\n";
        outputTemplate += "<% for(var i=0; i< items.length; i++) {%>";
        outputTemplate += "   $templateCache.put('<%=items[i].key%>', <%-items[i].escapedContent%>);\n";
        outputTemplate += "<% }%>";
        outputTemplate +=" });";



    function loadLocale(parent, locale) {
      var locale_file = parent + "/i18n/locale_" + locale + ".json";
      if(grunt.file.isFile(locale_file)) {
        var local_locale = grunt.file.readJSON(locale_file);
        if(_.isEqual(local_locale.locale, defaultLocale)) {
          defaultLoc = local_locale; // set default locale
          return defaultLoc;
        }
        return _.merge(_.cloneDeep(defaultLoc), local_locale);
      }
      grunt.log.warn("locale " + locale + " not found. using default locale: " + defaultLoc.locale);
      return defaultLoc;
    }

    function readContents(f) {
        var file = grunt.file.read(f);
        var parent = path.dirname(f);
        var hasLocales = grunt.file.isDir(parent + "/i18n");
        var mergedfiles = [];

        options.locales.forEach(function (locale) {
          var loc = loadLocale(parent, locale);
              loc.getKey = function (key) {
                return "function: " + key;
              };
              loc.locale = locale;

          var cmpFile = minify(ejs.render(file, loc), options.htmlmin);
          var returnobject = {
            key : options.generateKey.call(this,locale, f),
            content: cmpFile,
            escapedContent: JSON.stringify(cmpFile)
          };
          mergedfiles.push(returnobject);
        });

        return mergedfiles;
    }

    function readFiles(globbing) {
      return function (f) {
        var data=[];
        grunt.file.expand({filter: 'isFile'}, globbing).forEach(function (f){
          data = data.concat(readContents(f));
          templates++;
        });
        return data;
      };
    }

    function renderFinalResult(template, data) {
      return ejs.render(template, data);
    }


    var results = {
      module: options.module,
      items: readFiles("test/src/**/*.html")(readContents)
    };

    var finalOutput = renderFinalResult(outputTemplate, results);

    grunt.file.write(options.dest, finalOutput);

    grunt.log.writeln("Compiled " + templates + " templates into " + options.locales.length + " locales, resulting into " + results.items.length + " total compiled templates.");

  return true;
  });

};
