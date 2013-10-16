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

      sqwidget:
        expand: true
        cwd: 'src',
        src: '**/*.coffee'
        dest: 'compiled/js'
        ext: '.js'
        options:
          sourceRoot: '../../../app'
          bare: true
          sourceMap: false

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

    requirejs:
      sqwidget:
        options:
          name: "sqwidget"
          optimize: 'uglify'
          baseUrl: "compiled/js",
          mainConfigFile: "compiled/js/sqwidget.js",
          out: "sqwidget.js"

      test:
        options:
          name: "src/index"
          findNestedDependencies: true
          optimize: 'none'
          baseUrl: "widgets/test",
          mainConfigFile: "widgets/test/src/index.js",
          out: "dist/test.js"

  grunt.registerTask "build", [ "coffee", "requirejs" ]
  grunt.registerTask "dist", [ "coffee", "requirejs" ]
  grunt.registerTask "test", [ "clean", "build", "karma" ]
  grunt.registerTask "default", [ "clean", "build", "connect", "watch" ]

