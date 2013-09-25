define [
  'backbone'
  'underscore'
  'Ractive'
  'rv!../templates/test.html'
  #"css!./css/app.css"
], (Backbone, _, Ractive, template) ->
  module = {views: {}}

  class module.Controller
    constructor: ({@settings} = {}) ->
      @view = new module.views.Test({ @settings })
      @view.render()

  class module.views.Test extends Backbone.View
    template: "<div>Test Widget</div>"
    className: "sqwidget-hello-world"
    constructor: ({@settings, @model} = {}) ->
      super
      @on('rendered', @rendered)

    render: =>
      @$el.html(@template)

    rendered: =>
      @$el.html(@settings.message).css("color", @settings.color)

  module
