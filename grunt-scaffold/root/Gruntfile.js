module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadTasks('tasks');
  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true
      }
    },
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
    uglify: {
      widget: {
        files: {
          'dist/{%= name %}.js': ['build/app/index.js']
        }
      }
    },
    shell: {
      build_cram: {
        options: { stdout: true, stderr: true },
        command: "./node_modules/cram/bin/cram build.js build.json --exclude ractive -o build/app/index.js -l loader.js"
      }
    },
    open: {
      widget: {
        path: "http://127.0.0.1:8082/",
        app: "Google Chrome"
      }
    },
    watch: {
      less: {
        files: ["app/less/**/*.less"],
        tasks: ["less"]
      },
      translate: {
        files: ["app/i18n.yml"],
        tasks: ["requirejs-i18n:widget"]
      }
    },
    'requirejs-i18n': {
      widget: {
        options: {
          src: 'app/i18n.yml',
          dest: 'app/nls/'
        }
      }
    },
    less: {
      widget: {
        files: {
          "app/compiled/css/main.css": "app/less/main.less"
        }
      }
    }
  });
  grunt.registerTask('default', ['build', 'connect', 'open', 'watch']);
  grunt.registerTask('build', ['less:widget', 'requirejs-i18n:widget']);
  grunt.registerTask('dist', ['clean', 'build', 'shell:build_cram', 'uglify']);
};
