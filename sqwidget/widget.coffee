requirejs.config
  paths:
    require: 'lib/require'
    jquery: 'lib/jquery'
    underscore: 'lib/underscore'
    backbone: 'lib/backbone'
    ractive: 'lib/ractive'
  shim:
    'jquery':
      exports: '$'
    'underscore':
      exports: '_'
    'backbone':
      deps: ['underscore', 'jquery']
      exports: 'Backbone'

requirejs ['jquery', 'underscore', 'backbone', 'require', 'app/resources'],
($, _, Backbone, require, Ractive, resources) ->
  Sqwidget = window.Sqwidget || {}

  _.extend(Sqwidget, Backbone.Events)

  # Just loads all the modules.
  # TODO: Remove jQuery.
  $(document).ready () =>
    $('div[data-sqwidget]').each (index) ->
      $this = $(this).addClass('sqwidget')
      url = $this.data('sqwidget')
      require ["#{url}/index.js"], (module) ->
        params = getWidgetParams($this)
        # 'settings' object defines all the settings that were passed in via the
        # embed code.
        widget = new module({settings: params})
        widget.render()
        $this.html(widget.el)
        # fire a 'rendered' method so that the widget can do any post-render
        # operations that it needs to do.
        widget.trigger("rendered")

  getWidgetParams = ($widget) ->
    data = []
    for key, val of $widget.data()
      key = key.replace("sqwidget", "").toLowerCase()
      if key != ""
        data[key] = val
    data
