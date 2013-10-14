tests = []

for file of window.__karma__.files
  if /spec\//.test(file)
    tests.push(file)


requirejs.config
  baseUrl: "/base/compiled/js/"
  paths:
    chai: '../../node_modules/karma-chai-plugins/node_modules/chai/chai'
    jquery: '../../lib/jquery/jquery'
    underscore: '../../lib/underscore-amd/underscore'
    backbone: '../../lib/backbone-amd/backbone'

  deps: tests
  callback: ->
    #set the URI for the example widgets to the karma server port
    window.__karma__.start()

#list all your unit files here
#require ["angular", "angularMocks", "/compiled/js/test/unit.js"], ->
  #window.__karma__.start()
