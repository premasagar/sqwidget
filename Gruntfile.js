module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-shell');
  grunt.initConfig({
    bower: grunt.file.readJSON('bower.json'),

    clean: {
      all: {
        src: ["build", "compiled", "dist"]
      }
    },

    copy: {
      bower: {
        src: 'bower.json',
        dest: 'dist/',
      }
    },

    connect: {
      publisher: {
        options: {
          port: 8000,
          base: '.'
        }
      },
      sqwidget: {
        options: {
          port: 8002,
          base: 'example-widget'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "src",
          out: '<%= bower.name %>.js',
          paths: {
            requirejs: 'lib/requirejs/require',
            domReady: 'lib/requirejs-domready/domReady',
          },
          include: ['requirejs', 'sqwidget'],
          wrap: {
            startFile: 'src/_wrapper/top.js',
            endFile: 'src/_wrapper/bottom.js'
          },
          optimize: 'uglify2',
          //optimize: 'none',
          //required for source maps, we should probably have 2 configs one
          //without source maps or uglification
          generateSourceMaps: false
          //preserveLicenseComments: false,
          //generateSourceMaps: true
        }
      }
    },
    karma: {
      options: {
        configFile: './karma.conf.js',
        browsers: ['Chrome', 'Firefox']
      },
      unit: {
        background: true
      },
      //continuous integration mode: run tests once in PhantomJS browser.
      continuous: {
        singleRun: true,
        browsers: ['PhantomJS']
      },
    },

    shell: {
      build_example: {
        options: { stdout: true, stderr: true },
        command: "./build_example.sh"
      }
    },

    watch: {
      test: {
        files: ["test/fixture/*.js", "src/*.js", "test/spec/*.js"],
        tasks: ["karma:unit:run"]
      },
      sqwidget: {
        files: ["src/*.js", "test/spec/*.js"],
        tasks: ["karma:unit:run", "build"]
      },
      scaffold: {
        files: ["grunt-scaffold/root/main.js", "grunt-scaffold/root/app/**/*.js", "grunt-scaffold/**/*.tmpl"],
        tasks: ["build"]
      }
    }

  });
  grunt.registerTask("build", ["requirejs:compile"]);
  grunt.registerTask("dist", ["clean", "karma:unit", "build" ]);
  grunt.registerTask("test", ["clean", "karma:unit", "watch:test"]);
};
