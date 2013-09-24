define [
  'jquery'
  'underscore'
  'backbone'
  'ractive'
  'component/resources'
  'config'
], ($, _, Backbone, Ractive, resources, config) ->
  module = {}

  class module.Collection extends resources.Collection
    refreshInterval: config.refresh_interval or 60000 # default refresh time
    constructor: (models, options) ->
      super(models, options)
      @fetch()
      @setupRefresh()

    fetch: (options = {}) =>
      # add the api_key as a parameter on all the calls.
      options.data ?= {}
      options.data = _.extend options.data, {
        "api_key": config.api_key,
      }
      super(options)

    parse: (response, options) =>
      return response.olympics if response.olympics

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
    url: "#{config.url_root}/#{config.games_id}/schedule"
    parse: (response, options) =>
      return response.olympics.schedule if response.olympics.schedule
      super

  module
