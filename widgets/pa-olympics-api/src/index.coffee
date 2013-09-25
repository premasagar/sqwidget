define [
  'jquery'
  'underscore'
  'backbone'
  'Ractive'
  'component/resources'
  'config'
], ($, _, Backbone, Ractive, resources, config) ->
  module = {}

  class module.Collection extends Backbone.Collection
    refreshInterval: config.refresh_interval or 60000 # default refresh time
    constructor: (models, options) ->
      super(models, options)
      @fetch() # fetch immediately after init
      @setupRefresh()

    # send all requests from the API as JSONP
    sync: (method, model, options) ->
      options = _.extend {
        type: "GET"
        dataType: "jsonp"
      }, options
      super(method, model, options)

    # add the api_key as a parameter on all the calls.
    fetch: (options = {}) =>
      options.data ?= {}
      options.data = _.extend options.data, {
        "api_key": config.api_key,
      }
      super(options)

    # weed out the parent level object to return a proper model-based array. All
    # collections should over-ride this to create their own models.
    parse: (response, options) =>
      return response.olympics if response.olympics

    # refresh the data for subscribed collections automatically.
    setupRefresh: =>
      @intervalId = window.setInterval(@fetch, @refreshInterval)

    destroy: =>
      window.clearInterval(@intervalId)


  # using Ractive for templates
  class module.View extends Backbone.View
    template: null
    templateContext: ->
      if @model?.attributes
        return @model.toJSON()
      return {}

    render: ->
      @$el.html(@template)


  class module.ScheduleItem extends Backbone.Model

  class module.Schedule extends module.Collection
    model: module.ScheduleItem
    url: "#{config.api_root}/#{config.games_id}/schedule"
    parse: (response, options) =>
      return response.olympics.schedule if response.olympics.schedule
      super

  module
