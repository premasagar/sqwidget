module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-bower-release');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-shell');
  grunt.initConfig({
    bower: grunt.file.readJSON('bower.json'),

    clean: {
      all: {
        src: ["build", "compiled", "dist"]
      }
    },

    uglify: {
      sqwidget: {
        files: {
          'build/sqwidget-min.js': ['build/sqwidget.js']
        }
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
          out: 'dist/<%= bower.name %>.js',
          paths: {
            almond: 'lib/almond/almond',
            requirejs: 'lib/requirejs/require',
            domReady: 'lib/requirejs-domready/domReady',
          },
          include: ['requirejs', 'sqwidget'],
          // Wrapper for AMD
          wrap: {
            startFile: 'src/_wrapper/top.js',
            endFile: 'src/_wrapper/bottom.js'
          },
          //optimize: 'uglify2',
          optimize: 'none',
          generateSourceMaps: true
        }
      }
    },

    shell: {
      build_example: {
        command: "./build_example.sh"
      }
    },

    watch: {
      scaffold: {
        files: ["grunt-scaffold/root/main.js", "grunt-scaffold/root/app/**/*.js", "grunt-scaffold/**/*.tmpl"],
        tasks: ["build"]
      }
    },

    bowerRelease: {
      stable: {
        options: {
          endpoint: 'git://github.com/premasagar/sqwidget.git',
          packageName: "sqwidget.js",
          stageDir: '.temp'
        },
        files: {
          "sqwidget.js": ['dist/sqwidget.js'],
        }
      }
    }

  });
  grunt.registerTask("build", ["requirejs:compile"]);
  grunt.registerTask("default", ["clean", "build", "connect", "watch"]);
  grunt.registerTask("dist", ["clean", "build"]);
  grunt.registerTask("release", ["dist", "bowerRelease:stable"]);
};
