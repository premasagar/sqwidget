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
      unit:
        options:
          files: ["sqwidget/tests/**.coffee", "sqwidget/tests/fixtures/**.html"]
        background: true
        frameworks: ["mocha", "chai"]
        plugins: ["karma-coffee-preprocessor", "karma-html2js-preprocessor",
                  "karma-mocha", "karma-chai", "karma-sinon", "karma-chrome-launcher",
                  "karma-firefox-launcher", "karma-phantomjs-launcher"]
        browsers: ["Firefox", "Chrome", "PhantomJS"]
        preprocessors:
          'sqwidget/tests/**.coffee': ['coffee']

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
  grunt.registerTask "test", [ "build", "karma", "watch:karma" ]
  grunt.registerTask "default", [ "clean", "build", "connect", "watch" ]

