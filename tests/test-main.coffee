tests = []

for file of window.__karma__.files
  if /spec\//.test(file)
    tests.push(file)


requirejs.config
  baseUrl: "/base/compiled/js/"
  paths:
    chai: '../../node_modules/karma-chai-plugins/node_modules/chai/chai'
    EventEmitter: '../../node_modules/wolfy87-eventemitter/EventEmitter'
    ondomready: '../../lib/ondomready'
    qwery: '../../lib/qwery/qwery'
    heir: '../../lib/heir/heir'
    bonzo: '../../lib/bonzo/bonzo'

  deps: tests
  callback: ->
    #set the URI for the example widgets to the karma server port
    window.__karma__.start()

#list all your unit files here
#require ["angular", "angularMocks", "/compiled/js/test/unit.js"], ->
  #window.__karma__.start()
