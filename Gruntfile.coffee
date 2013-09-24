module.exports = (grunt) ->
  grunt.initConfig
    connect:
      publisher:
        options:
          port: 8000
          base: 'publisher'
      sqwidget:
        options:
          port: 8001
          base: 'dist/sqwidget'
      widgets:
        options:
          port: 8002
          base: 'dist/widgets'
    coffee:
      sqwidget:
        expand: true
        bare: true
        cwd: "sqwidget/"
        src: ["**/*.coffee"]
        dest: "dist/sqwidget/"
        rename: (dst, name) -> dst + name.replace(".coffee", ".js")
      widgets:
        expand: true
        bare: true
        cwd: "widgets/"
        src: ["**/*.coffee"]
        dest: "dist/widgets/"
        rename: (dst, name) -> dst + name.replace(".coffee", ".js")
    copy:
      sqwidget:
        src: "sqwidget/**"
        dest: "dist/"
      widgets:
        src: "widgets/**"
        dest: "dist/"
      config:
        src: "config.js"
        dest: "dist/sqwidget/config.js"
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
      publisher:
        files: ["publisher/**"]
        tasks: ["connect:publisher"]

      sqwidget:
        files: ["sqwidget/**"]
        tasks: ["copy:sqwidget", "coffee:sqwidget", "connect:sqwidget"]

      widgets:
        files: ["widgets/**"]
        tasks: ["copy:widgets", "coffee:widgets", "connect:widgets"]

      karma:
        files: ["sqwidget/**", "sqwidget/tests/**"]
        tasks: ["karma:unit:run"]

  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-karma')

  grunt.registerTask "build", [ "coffee", "copy" ]
  grunt.registerTask "test", [ "build", "karma", "watch:karma" ]
  grunt.registerTask "default", [ "build", "connect", "watch" ]

