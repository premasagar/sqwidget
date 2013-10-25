module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-requirejs')
  grunt.loadNpmTasks('grunt-karma')

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

    coffee:
      tests:
        expand: true
        cwd: 'tests',
        src: '**/*.coffee'
        dest: 'compiled/tests/js'
        ext: '.js'
        options:
          sourceRoot: '../../../app'
          bare: true
          sourceMap: false

    karma:
      integration:
        configFile: 'karma.conf.js',

    watch:
      karma:
        files: ["src/**/*.coffee", "tests/**/*.coffee"]
        tasks: ["build", "karma"]

    requirejs:
      sqwidget:
        options:
          name: "sqwidget"
          optimize: 'none'
          baseUrl: "compiled/js",
          mainConfigFile: "compiled/js/sqwidget.js",
          out: "sqwidget.js"

  grunt.registerTask "build", [ "coffee", "requirejs" ]
  grunt.registerTask "dist", [ "coffee", "requirejs" ]
  grunt.registerTask "test", [ "clean", "build", "karma" ]
  grunt.registerTask "default", [ "clean", "build", "connect", "watch" ]

