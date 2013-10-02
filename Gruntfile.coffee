module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-karma')


  grunt.initConfig

    clean:
      all:
        src: [ "compiled" ]

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

      sqwidget:
        expand: true
        cwd: 'src',
        src: '**/*.coffee'
        dest: 'compiled/js'
        ext: '.js'
        options:
          sourceRoot: '../../../app'
          bare: true
          sourceMap: true

    karma:
      integration:
        configFile: 'karma.conf.js',

    watch:
      sqwidget:
        files: ["src/**/*.coffee"]
        tasks: ["build"]

      karma:
        files: ["src/**/*.coffee", "tests/**/*.coffee"]
        tasks: ["build", "karma"]

  grunt.registerTask "build", [ "coffee" ]
  grunt.registerTask "test", [ "clean", "build", "karma" ]
  grunt.registerTask "default", [ "clean", "build", "connect", "watch" ]

