requirejs.config
  paths:
    ondomready: '../../lib/ondomready'
    qwery: '../../lib/qwery/qwery'
    heir: '../../lib/heir/heir'
    EventEmitter: '../../node_modules/wolfy87-eventemitter/EventEmitter'
    bonzo: '../../lib/bonzo/bonzo'

# The module that is loaded first
requirejs [
  'ondomready'
  'component/core'
  'component/test'
], ( ondomready, Core) ->

  # the only global object that we will use.
  sqwidget = window.sqwidget = new Core()
  # Iterate all elements and register
  ondomready ->
    $('div[data-sqwidget]').each (index) ->
      sqwidget.register(@)

