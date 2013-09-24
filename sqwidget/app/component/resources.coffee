define ['backbone', 'underscore'], (Backbone, _) ->
  module = {}

  # A collection should need to do a few extra things for us:
  # - allow a collection 'resource' to be shared between different widgets.
  # Multiple widgets should ideally share calls to the sever and the data.
  class module.Collection extends Backbone.Collection
    sync: (method, model, options) ->
      options = _.extend {
        type: "GET"
        dataType: "jsonp"
      }, options
      super(method, model, options)


  class module.Model extends Backbone.Model
    sync: (method, model, options) ->
      options = _.extend {
        type: "GET"
        dataType: "jsonp"
      }, options
      super(method, model, options)

  module
