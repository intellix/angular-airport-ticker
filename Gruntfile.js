module.exports = function(grunt) {
  grunt.initConfig({

    clean: ['dist'],

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['default']
      },
      compass: {
        files: ['src/*.scss'],
        tasks: ['compass:dist']
      },
      tpls: {
        files: ['src/**/*.html'],
        tasks: ['ngtemplates']
      }
    },

    jshint: {
      files: ['Gruntfile.js','src/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    compass: {
      options: {
        importPath: '.',
        sassDir: 'src',
        cssDir: 'dist',
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {}
    },

    copy: {
      prod: {
        expand: true,
        cwd: 'src',
        dest: 'dist',
        src: [
          '*.js',
          '!*.spec.js'
        ]
      }
    },

    concat: {
      dist: {
        src: [
          'src/*.js',
          '!src/*.spec.js'
        ],
        dest: 'dist/airport-ticker.js'
      }
    },

    ngAnnotate: {
      dist: {
        options: {
          singleQuotes: true
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: 'airport-ticker.js',
          dest: 'dist'
        }]
      }
    },

    ngtemplates: {
      angularSliderTabs: {
        options: {
          htmlmin: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true
          }
        },
        cwd: 'src',
        src: '**/*.tpl.html',
        dest: 'dist/airport-ticker.tpl.js'
      }
    },

    uglify: {
      prod: {
        files: {
          'dist/airport-ticker.min.js': [
            'dist/airport-ticker.js',
            'dist/airport-ticker.tpl.js'
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build', ['ngtemplates', 'compass:dist', 'concat', 'ngAnnotate', 'uglify']);
};
