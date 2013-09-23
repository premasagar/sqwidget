define ['backbone', 'underscore', 'require'], (Backbone, _, require) ->

  class module extends Backbone.View
    template: "<div>Hello Widget</div>"
    constructor: ({@settings} = {}) ->
      super
      @on('rendered', @rendered)

    render: =>
      @$el.html(@template)

    rendered: =>
      @$el.html(@settings.message).css("color", @settings.color)

  module
