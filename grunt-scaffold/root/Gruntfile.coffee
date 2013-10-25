module.exports = (grunt) ->

  #grunt.loadNpmTasks 'grunt-contrib-clean'
  #grunt.loadNpmTasks 'grunt-contrib-watch'
  #grunt.loadNpmTasks 'grunt-contrib-connect'
  #grunt.loadNpmTasks 'grunt-contrib-requirejs'
  grunt.loadTasks 'tasks'


  grunt.initConfig

    jshint:
      options:
        curly: true
        eqeqeq: true
        immed: true
        latedef: true
        newcap: true
        noarg: true
        sub: true
        undef: true
        unused: true
        boss: true
        eqnull: true
        browser: true

    clean:
      all:
        src: [ "compiled", "dist" ]

    connect:
      widget:
        options:
          port: 8080
          base: '.'

    watch:
      widget:
        files: ["app/src/**/*"]
        tasks: ["build"]

    'requirejs-i18n':
      widget:
        options:
          src: 'app/i18n.yml'
          dest: 'app/nls/'

  grunt.registerTask 'default', ['build', 'connect', 'watch']
  grunt.registerTask 'build', ['requirejs']
