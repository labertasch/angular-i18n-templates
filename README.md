# grunt-angular-i18n-templates

> This plugin precompiles html files/templates and put them into angular template cache. It is also reading locale information and generating localized templates

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-angular-i18n-templates --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-i18n-templates');
```

## The "angular_i18n_templates" task

### Overview
In your project's Gruntfile, add a section named `angular_i18n_templates` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  angular_i18n_templates: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
This is the minimal configuration. it will search for all `*.html` files for the given locales. The task is looking for i18n folder next to the html template file.
inside this folder it is looking for `locale_{locale}.json`. For instance for the locale en, it will search for `i18n/locale_en.json`.
The first locale will be the default locale. If for there is no locale existing it will fallback to the default locale. the other locales wil be merged into the default locale.

This project is using [html-minifier](https://github.com/kangax/html-minifier). You can pass all html-minifier options into `htmlmin` option.


```js
grunt.initConfig({
angular_i18n_templates: {
  options: {
    locales: ["en", "de", "it", "fr", "ch_de", "ch_fr"],
    src: "src/**.html",
    dest: "build/templates.js",
  },
  dev: {
    options: {
      htmlmin : {
        removeComments: true,
        collapseWhitespace: true
      }
    }
  }
}});
```

#### Custom Options
You can change the module name and format. additionally you can overwrite the generateKey function.
This plugin is using the file path as a key and prepending the locale. if the template file is located in `test/src/templates/header.html` the key
for `en` locale will be `en/test/src/templates/header.html` or for `ch_de` it would be `ch_de/test/src/templates/header.html`. this example
is removing test/src from the key and replacing underscore with slash. the result ist then `ch/de/templates/header.html`

```js
grunt.initConfig({
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

    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
