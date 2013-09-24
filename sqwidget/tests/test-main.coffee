tests = []
for file of window.__karma__.files
  console.log file
  if /spec\//.test(file)
    tests.push(file)

requirejs.config
  baseUrl: "/base/compiled/sqwidget"
  paths:
    require: '../../sqwidget/lib/requirejs/require'
    jquery: '../../sqwidget/lib/jquery/jquery'
    underscore: '../../sqwidget/lib/underscore-amd/underscore'
    backbone: '../../sqwidget/lib/backbone-amd/backbone'
    ractive: '../../sqwidget/lib/ractive/Ractive'
    normalize: '../../sqwidget/lib/normalize-css/normalize'
  deps: tests
  callback: ->
    #set the URI for the example widgets to the karma server port
    window.__karma__.start()

#list all your unit files here
#require ["angular", "angularMocks", "/compiled/js/test/unit.js"], ->
  #window.__karma__.start()
