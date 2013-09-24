define [
  'backbone'
  'underscore'
  "./../pa-olympics-api/index.js"
  "css!./css/app.css"
], (Backbone, _, PAOlympicsApi) ->
  module = {views: {}}

  class module.Controller
    constructor: ({@settings} = {}) ->
      @model = new PAOlympicsApi.Schedule()
      @view = new module.views.HelloWorld({@model, @settings})
      @view.render()


  class module.views.HelloWorld extends Backbone.View
    template: "<div>Hello Widget</div>"
    className: "sqwidget-hello-world"
    constructor: ({@settings, @model} = {}) ->
      super
      @on('rendered', @rendered)

    render: =>
      @$el.html(@template)

    rendered: =>
      @$el.html(@settings.message).css("color", @settings.color)

  module
