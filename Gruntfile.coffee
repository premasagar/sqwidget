module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-watch'

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

      widgets:
        options:
          port: 8002
          base: 'widgets'

    coffee:

      tests:
        expand: true
        cwd: 'sqwidget/tests',
        src: '**/*.coffee'
        dest: 'compiled/tests/js'
        ext: '.js'
        options:
          sourceRoot: '../../../app'
          bare: true
          sourceMap: false

      sqwidget:
        expand: true
        cwd: 'sqwidget/app',
        src: '**/*.coffee'
        dest: 'compiled/sqwidget/js'
        ext: '.js'
        options:
          sourceRoot: '../../../app'
          bare: true
          sourceMap: true

      widgets:
        expand: true
        cwd: 'widgets/',
        src: '**/*.coffee'
        dest: 'compiled/widgets/js'
        ext: '.js'
        options:
          bare: true
          sourceMap: true

    karma:
      integration:
        configFile: 'config/karma.conf.js',

    watch:

      sqwidget:
        files: ["sqwidget/app/**/*.coffee"]
        tasks: ["build"]

      widgets:
        files: ["widgets/**/*.coffee"]
        tasks: ["build"]

      karma:
        files: ["sqwidget/**", "sqwidget/tests/**"]
        tasks: ["karma:unit:run"]

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-karma')

  grunt.registerTask "build", [ "coffee" ]
  grunt.registerTask "test", [ "clean", "build", "karma", "watch:karma" ]
  grunt.registerTask "default", [ "clean", "build", "connect", "watch" ]

