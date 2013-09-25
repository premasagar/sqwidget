#Example widget using ractive to handle its view

define [
  'underscore'
  'backbone'
  'Ractive'
  'rv!../templates/test.html'
  #"css!./css/app.css"
], (_, Backbone, Ractive, template) ->
  module = {views: {}}

  class module.Controller
    constructor: ({@el, @settings} = {}) ->
      view = new Ractive
        el: @el,
        template: template,
        data:
          test: "TEST"

  module
