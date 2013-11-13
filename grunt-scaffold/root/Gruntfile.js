module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadTasks('tasks');
  grunt.initConfig({
    bower: grunt.file.readJSON('bower.json'),

    clean: {
      all: {
        src: ["compiled", "build", "dist"]
      }
    },

    connect: {
      widget: {
        options: {
          port: 8082,
          hostname: '*',
          base: '.'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "src",
          out: 'dist/<%= bower.name %>.js',
          paths: {
            i18n: 'lib/requirejs-i18n/i18n',
            text: 'lib/requirejs-text/text',
            core: 'lib/pa-olympics-core/dist/pa-olympics-core',
            rv: 'lib/requirejs-ractive/rv',
            Ractive: 'lib/ractive/build/Ractive'
          },
          packages: [
            { name: 'lodash', location: 'lib/lodash-amd' }
          ],
          map: {
            '*': {
              'css': 'lib/require-css/css'
            }
          },
          exclude: [],
          include: ['main'],
          // Wrapper for sqwidget compatibility
          wrap: {
            startFile: 'src/_wrapper/top.js',
            endFile: 'src/_wrapper/bottom.js'
          },
          optimize: 'uglify2',
          //optimize: 'none',
          //required for source maps, we should probably have 2 configs one
          //without source maps or uglification
          preserveLicenseComments: false,
          generateSourceMaps: true
        }
      }
    },

    open: {
      schedule: {
        path: "http://127.0.0.1:8082/",
        app: "Google Chrome"
      }
    },

    watch: {
      dist: {
        files: ["src/*.js", "src/_wrapper/*.js"],
        tasks: ["requirejs:compile"]
      },
      less: {
        files: ["src/less/**/*.less"],
        tasks: ["less"]
      },
      translate: {
        files: ["src/i18n.yml"],
        tasks: ["requirejs-i18n:widget"]
      }
    },

    'requirejs-i18n': {
      widget: {
        options: {
          src: 'src/i18n.yml',
          dest: 'src/nls/'
        }
      }
    },

    less: {
      widget: {
        files: {
          "src/compiled/css/main.css": "src/less/main.less"
        }
      }
    }
  });
  grunt.registerTask('default', ['build', 'connect', 'open', 'watch']);
  grunt.registerTask('build', ['less:widget', 'requirejs-i18n:widget', 'requirejs:compile' ]);
  grunt.registerTask('dist', [ 'clean', 'build' ]);
};
