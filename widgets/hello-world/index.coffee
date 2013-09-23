define ['backbone', 'underscore', 'require', "css!./css/app.css"], (Backbone, _, require) ->

  class module extends Backbone.View
    template: "<div>Hello Widget</div>"
    className: "sqwidget-hello-world"
    constructor: ({@settings} = {}) ->
      super
      @on('rendered', @rendered)

    render: =>
      @$el.html(@template)

    rendered: =>
      @$el.html(@settings.message).css("color", @settings.color)

  module
