define [
  'backbone'
  'underscore'
  'Ractive'
  'rv!../templates/test.html'
  #"css!./css/app.css"
], (Backbone, _, Ractive, template) ->
  module = {views: {}}

  class module.Controller
    constructor: ({@el, @settings} = {}) ->
      view = new Ractive
        el: @el,
        template: template,
        data:
          test: "TEST"


  module
