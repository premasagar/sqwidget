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


  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask "default", [
    "coffee"
    "copy"
    "connect"
    "watch"
  ]

