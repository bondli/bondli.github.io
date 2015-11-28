// Generated on 2014-12-24 using generator-admix 0.0.1
'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'build'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: [
          '<%= yeoman.app %>/pages/{,*/}*.js',
          '<%= yeoman.app %>/components/*.js'
        ],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      compass: {
        files: ['<%= yeoman.app %>/components/*.scss'],
        tasks: ['compass:server']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          './demo/{,*/}*.html'
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
          middleware: function (connect) {
            return [
              connect.static('.tmp'), //css加载到访问路径
              connect().use(
                '/demo',
                connect.static('./demo') //页面加载到访问路径
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect().use(
                '/demo',
                connect.static('./demo') //组件页面到访问路径
              ),
              connect.static(appConfig.dist)
            ];
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/pages/{,*/}*.js',
          '<%= yeoman.app %>/components/{,*/}*.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Compiles less to CSS and generates necessary files if requested
    compass: {
      server: {
        options: {
          sassDir: '<%= yeoman.app %>/components',
          cssDir: '<%= yeoman.app %>/components/',
          cacheDir: '.tmp/',
          relativeAssets: false,
          assetCacheBuster: false,
          raw: 'Sass::Script::Number.precision = 10\n',
          debugInfo: false
        }
      }
    },

    // copy components to build
    copy: {
      app: {
        expand: true,
        cwd: '<%= yeoman.app %>/components',
        dest: '<%= yeoman.dist %>',
        src: ['*.js', '*.scss', '*.css']
      }
    },

    // generator index.html
    genindex : {
      options: {
        'target': '.tmp'
      },
      files: ['./demo/*.html']
    }

  });


  grunt.registerTask('serve', [
    'clean:server',
    'compass:server',
    'genindex',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'compass:server',
    'copy:app'
  ]);

  grunt.registerTask('default', [
    'serve'
  ]);
};
