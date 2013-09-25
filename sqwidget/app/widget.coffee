requirejs.config
  paths:
    jquery: '../../lib/jquery/jquery'
    underscore: '../../lib/underscore-amd/underscore'
    backbone: '../../lib/backbone-amd/backbone'
    ractive: '../../lib/ractive/Ractive'
    text: 'plugins/text',
    rv: 'plugins/rv'
    normalize: '../../lib/normalize-css/normalize'
    config: '../../config'

# The module that is loaded first
requirejs [
  'jquery'
  'component/core'
], ($, Core) ->

  # the only global object that we will use.
  sqwidget = window.sqwidget = new Core()
  # Iterate all elements and register
  $(document).ready ->
    $('div[data-sqwidget]').each (index) ->
      sqwidget.register(@)

