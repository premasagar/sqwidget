module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-shell');
  grunt.initConfig({
    bower: grunt.file.readJSON('bower.json'),
    clean: {
      all: {
        src: ["compiled", "dist"]
      }
    },
    concat: {
      sqwidget: {
        files: {
          'dist/sqwidget-<%= bower.version %>.min.js': ['app/lib/curl/dist/curl/curl.js', 'build/sqwidget-min.js']
        }
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
    karma: {
      integration: {
        configFile: 'karma.conf.js'
      }
    },
    shell: {
      build_example: {
        command: "./build_example.sh"
      },
      build_cram: {
        command: "./node_modules/cram/bin/cram sqwidget.js build.json -o build/sqwidget.js"
      }
    },
    watch: {
      scaffold: {
        files: ["grunt-scaffold/root/main.js", "grunt-scaffold/root/app/**/*.js", "grunt-scaffold/**/*.tmpl"],
        tasks: ["build"]
      }
    }
  });
  grunt.registerTask("build", ["shell:build_example"]);
  grunt.registerTask("test", ["clean", "build", "karma"]);
  grunt.registerTask("default", ["clean", "build", "connect", "watch"]);
  grunt.registerTask("dist", ["shell:build_cram", "uglify", "concat"]);
};
