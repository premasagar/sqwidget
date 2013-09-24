requirejs.config
  paths:
    require: 'lib/require'
    jquery: 'lib/jquery'
    underscore: 'lib/underscore'
    backbone: 'lib/backbone'
    ractive: 'lib/Ractive'
    text: 'lib/text'
    css: 'lib/css'
    normalize: 'lib/normalize'
  shim:
    'jquery':
      exports: '$'
    'underscore':
      exports: '_'
    'backbone':
      deps: ['underscore', 'jquery']
      exports: 'Backbone'

# The module that is loaded first
requirejs [
  'jquery'
  'underscore'
  'backbone'
  'require'
  'ractive'
], ($, _, Backbone, require, Ractive) ->
  # the only global object that we will use.
  Sqwidget = window.Sqwidget || {}

  # add pub/sub to sqwidget. may be removed for a cleaner implementation
  _.extend(Sqwidget, Backbone.Events)

  # Just loads all the widgets
  # TODO: Remove jQuery.
  $(document).ready () =>
    $('div[data-sqwidget]').each (index) ->
      $this = $(this).addClass('sqwidget')
      url = $this.data('sqwidget')
      # we're expecting an 'index.js' file inside every widget.
      # TODO: Use grunt to concat all the widget JS files into a single index.js
      # file.
      require ["#{url}/index.js"], (module) ->
        params = getWidgetParams($this)
        # 'settings' object defines all the settings that were passed in via the
        # embed code.
        widget = new module({settings: params})
        widget.render() if _.isFunction(widget.render)
        $this.html(widget.el)
        # fire a 'rendered' method so that the widget can do any post-render
        # operations that it needs to do.
        widget.trigger("rendered")

  # returns an array of all the custom widget parameters. The new keys are
  # lowercase concatenated attributes from the embed code with 'data-sqwidget-'
  # removed.
  #
  # eg:
  #     'data-sqwidget-color="#F00" -> `data['color'] = '#F00'`
  #     'data-sqwidget-bg-color='#FFF' -> data['bgcolor'] = '#FFF'
  getWidgetParams = ($widget) ->
    data = []
    for key, val of $widget.data()
      key = key.replace("sqwidget", "").toLowerCase()
      if key != ""
        data[key] = val
    data
