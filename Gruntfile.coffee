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
          base: 'sqwidget'
      widgets:
        options:
          port: 8002
          base: 'widgets'
    watch:
      publisher:
        files: ["publisher/**"]
        tasks: ["connect:publisher"]
      sqwidget:
        files: ["sqwidget/**"]
        tasks: ["connect:sqwidget"]
      widgets:
        files: ["widgets/**"]
        tasks: ["connect:widgets"]


  # grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect')

  grunt.registerTask "default", [
    # "coffee"
    "connect"
    "watch"
  ]

