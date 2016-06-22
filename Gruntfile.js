// Generated on 2014-05-01 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
//
var untildify = require('untildify');

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    hostname: process.env.SSO_DEV_HOST || 'localhost',
    port: process.env.SSO_DEV_PORT || 9000,
    year: new Date().getFullYear(),
    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all','karma:liveunit:run'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma:liveunit:run']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{less,css}'],
        tasks: ['less','autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      html: {
        files: ['<%= yeoman.app %>/{,*/}*.html'],
        tasks: ['includes:html']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: '<%=port %>',
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          //open: 'http://<%=hostname %>:<%=port %>',
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    less: {
      development:{
        files: {
          '.tmp/styles/main.css':'<%= yeoman.app %>/styles/main.less'
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
        '<%= yeoman.app %>/scripts/{,*/}*.js'
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
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 3 versions']
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

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/'
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      dist:{
        src: '<%= yeoman.app %>/index.html',
        options: {
          dest: '<%= yeoman.dist %>',
          flow: {
            html: {
              steps: {
                js: ['concat', 'uglifyjs'],
                css: ['cssmin']
              },
              post: {}
            }
          }
        }
      },
      debug:{
        src: '<%= yeoman.app %>/index.html',
        options: {
          dest: '<%= yeoman.dist %>',
          flow: {
            html: {
              steps: {
                js: ['concat'],
                css: ['cssmin']
              },
              post: {}
            }
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= yeoman.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        },{
          expand: true,
          cwd: '.tmp',
          dest: '<%= yeoman.dist %>',
          src: ['*.html']
        },{
          expand: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: ['error.html']
        }]
      },
      less: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.{less}'
      },
      debug: {
        expand: true,
        cwd: '.tmp/concat/scripts',
        dest: '<%= yeoman.dist %>/scripts',
        src: '{,*/}*.js'
      },
      dest:{
        cwd: '<%= yeoman.dist %>',
        src: '**/*',
        dest: grunt.option('dest') ? untildify(grunt.option('dest')):'',
        expand: true
      },
    },
    includes: {
      html:{

        src: ['<%= yeoman.app %>/index.html'], // Source files
        dest: '.tmp/index.html', // Destination directory
        options: {
          // flatten: true,
          silent: false,
          banner: ''
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:less',
        'less',
        'includes:html'
      ],
      test: [
        'copy:less'
      ],
      dist: [
        'copy:less',
        'less',
        'includes:html',
        'imagemin',
        'svgmin'
      ]
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js', // Default config file
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
      },
      dev: {
        options: {
          args: {
            baseUrl: 'http://<%=hostname %>:<%=port %>',
            params: {
              appUrl: '/',
              apiUrl: 'http://fakeapi.stormpath.com:1337'
            }
          }
        }
      },
      sauce: {
        options: {
          configFile: 'protractor.conf.sauce.js',
          args: {
            sauceUser: process.env.SAUCE_USER,
            sauceKey: process.env.SAUCE_API_KEY,
            baseUrl: 'http://<%=hostname %>:<%=port %>',
            params: {
              appUrl: '/',
              apiUrl: 'http://fakeapi.stormpath.com:1337'
            }
          }
        }
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    concat: {
      dist: {
        options: {
          banner: '/*\n' +
            ' Stormpath ID Site v<%= pkg.version %>\n' +
            ' (c) 2014-<%= year %> Stormpath, Inc. http://stormpath.com\n'+
            ' License: Apache 2.0\n' +
            '*/\n',
        },
        files: {
          'dist/scripts/app.js': ['dist/scripts/app.js'],
          'dist/scripts/vendor.js': ['dist/scripts/vendor.js']
        }
      }
    },

    // Test settings

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      liveunit: { // starts a karma server in the background
        configFile: 'karma.conf.js',
        background: true
      }
    },
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      // 'karma:liveunit',  // disabled until karama test runner is fixed
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', 'Build the project, assets are placed in dist/',
    [
      'clean:dist',
      'bowerInstall',
      'useminPrepare:dist',
      'concurrent:dist',
      'autoprefixer',
      'concat',
      'ngmin',
      'copy:dist',
      'cdnify',
      'cssmin',
      'uglify',
      // 'rev',
      'usemin',
      // 'htmlmin'
      'concat:dist'
    ]
  );

  grunt.registerTask('build:debug', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare:debug',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'usemin',
    'copy:debug',
    'concat:dist'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('dist',
    'Use this task to build a distro and copy it to the directoroy sepcified by --dist on the command line',
    function(){
      if(grunt.option('dest')){
        return grunt.task.run(['build','copy:dest']);
      }else{
        throw new Error('Must specify destination with --dest option');
      }
    }
  );
};
