'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  // require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project meta
    pkg: require('./package.json'),
    bower: require('./bower.json'),
    meta: {
      banner: '/**\n' +
      ' * <%= pkg.name %>\n' +
      ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n'
    },

    // Project settings
    yo: {
      // Configurable paths
      src: require('./bower.json').appPath || 'src',
      dist: 'dist',
      docs: 'docs',
      pages: 'pages'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['{.tmp,<%= yo.src %>}/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all']
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        options: {
          spawn: false
        },
        files: ['{docs,<%= yo.src %>}/styles/{,*/}*.less'],
        tasks: ['less:dev', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '{docs,<%= yo.src %>}/{,*/}{,docs/}*.html',
          '{docs,.tmp,<%= yo.src %>}/{,*/}*.css',
          '{docs,.tmp,<%= yo.src %>}/{,*/}*.js',
          '{docs,<%= yo.src %>}/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            'docs',
            '<%= yo.src %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yo.src %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yo.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yo.src %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yo.dist %>/*',
            '!<%= yo.dist %>/.git*'
          ]
        }]
      },
      docs: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yo.pages %>/*',
            '!<%= yo.pages %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Compile less stylesheets
    less: {
      options: {
      },
      dev: {
        options: {
          dumpLineNumbers: 'comments',
        },
        files: [{
          src: '<%= yo.docs %>/styles/main.less',
          dest: '.tmp/styles/main.css'
        }]
      },
      docs: {
        options: {
          cleancss: true,
          report: 'gzip'
        },
        files: [{
          src: '<%= yo.docs %>/styles/main.less',
          dest: '.tmp/styles/main.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yo.docs %>/index.html',
      options: {
        dest: '<%= yo.pages %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: '<%= yo.pages %>/index.html',
      css: ['<%= yo.pages %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yo.pages %>', '<%= yo.pages %>/images']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yo.src %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yo.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yo.src %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yo.dist %>/images'
        }]
      }
    },

    // Minify html files
    htmlmin: {
      options: {
        collapseWhitespace: false,
        removeComments: false
      },
      docs: {
        files: [{
          expand: true,
          cwd: '<%= yo.docs %>',
          src: ['*.html'],//, 'views/{,*/}*.html'],
          dest: '<%= yo.pages %>'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yo.pages %>/*.html']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yo.pages %>/scripts/{,*/}*.js',
            '<%= yo.pages %>/styles/{,*/}*.css',
            '<%= yo.pages %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yo.pages %>/styles/fonts/*'
          ]
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      fonts: {
        files: [{
          expand: true,
          cwd: 'bower_components/font-awesome',
          dest: '<%= yo.pages %>',
          src: [
            'fonts/*'
          ]
        }]
      },
      docs: {
        files: [{
          expand: true,
          cwd: '<%= yo.docs %>/',
          dest: '<%= yo.pages %>',
          src: [
            'images/*',
            '1.0/**/*'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      docs: [
        'less:docs',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'htmlmin'
      ],
      server: [
        'less:dev'
      ],
      test: [
        'less:dev'
      ],
      dist: [
        'less:dist',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },

    concat: {
      // generated: {
      //   options: {
      //     banner: '(function(window, document, $, undefined) {\n\'use strict\';\n',
      //     footer: '\n})(window, document, window.jQuery);\n'
      //   }
      // },
      dist: {
        options: {
          // Replace all 'use strict' statements in the code with a single one at the top
          banner: '(function(window, document, $, undefined) {\n\'use strict\';\n',
          footer: '\n})(window, document, window.jQuery);\n',
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        files: {
          '<%= yo.dist %>/<%= pkg.name %>.js': [
            '<%= yo.src %>/module.js',
            '<%= yo.src %>/{,*/}*.js'
          ]
        }
      },
      banner: {
        options: {
          banner: '<%= meta.banner %>',
        },
        files: [{
          expand: true,
          cwd: '<%= yo.dist %>',
          src: '{,*/}*.js',
          dest: '<%= yo.dist %>'
        }]
      },
      docs: {
        options: {
          banner: '<%= meta.banner %>',
        },
        files: [{
          expand: true,
          cwd: '<%= yo.pages %>',
          src: ['scripts/{demo,docs,angular-strap}*', 'styles/{main}*'],
          dest: '<%= yo.pages %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          src: '<%= yo.dist %>/<%= pkg.name %>.js',
          dest: '<%= yo.dist %>/<%= pkg.name %>.js'
        }]
      },
      modules: {
        files: [{
          expand: true,
          flatten: true,
          cwd: '<%= yo.src %>',
          src: '{,*/}*.js',
          dest: '<%= yo.dist %>/modules'
        }]
      },
      docs: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    ngtemplates:  {
      docs: {
        options:  {
          module: 'mgcrea.ngStrapDocs',
          usemin: 'scripts/docs.min.js'
        },
        files: [{
          cwd: '<%= yo.src %>',
          src: '{,*/}docs/*.html',
          dest: '.tmp/ngtemplates/scripts/src-docs.js'
        },
        {
          cwd: '<%= yo.docs %>',
          src: 'views/{,*/}*.html',
          dest: '.tmp/ngtemplates/scripts/docs-views.js'
        }]
      }
    },

    uglify: {
      dist: {
        options: {
          report: 'gzip',
          sourceMap: '<%= yo.dist %>/<%= pkg.name %>.min.map',
          sourceMappingURL: '<%= pkg.name %>.min.map'
        },
        files: [{
          expand: true,
          cwd: '<%= yo.dist %>',
          src: '{,*/}*.js',
          dest: '<%= yo.dist %>',
          ext: '.min.js'
        }]
      }
    },

    // Test settings
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        browsers: ['PhantomJS']
      },
      unit: {
        singleRun: true
      },
      server: {
        autoWatch: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    // 'concurrent:test',
    // 'autoprefixer',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat:dist',
    'ngmin:dist',
    'ngmin:modules',
    'uglify:dist',
    'concat:banner'
  ]);

  grunt.registerTask('docs', [
    'clean:docs',
    'useminPrepare',
    // 'concurrent:docs',
    'less:docs',
    'autoprefixer',
    'htmlmin:docs',
    'ngtemplates:docs',
    'concat:generated',
    'ngmin:docs',
    'copy:fonts',
    'copy:docs',
    'cssmin:generated',
    'uglify:generated',
    'concat:docs',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

};
