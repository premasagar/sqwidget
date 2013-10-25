module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-shell'

  grunt.initConfig

    clean:
      all:
        src: [ "compiled", "dist" ]

    connect:
      publisher:
        options:
          port: 8000
          base: 'publisher'

      sqwidget:
        options:
          port: 8001
          base: 'sqwidget'

    karma:
      integration:
        configFile: 'karma.conf.js',

    shell:
      build_example:
        command: "./build_example.sh"

    watch:
      scaffold:
        files: ["grunt-scaffold/root/main.js", "grunt-scaffold/root/app/**/*.js", "grunt-scaffold/**/*.tmpl"]
        tasks: ["build"]

  grunt.registerTask "build", [ "shell:build_example" ]
  grunt.registerTask "test", [ "clean", "build", "karma" ]
  grunt.registerTask "default", [ "clean", "build", "connect", "watch" ]

