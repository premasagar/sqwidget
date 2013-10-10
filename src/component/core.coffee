define ['underscore', 'backbone'], (_, Backbone) ->

  class SqwidgetCore
    constructor: () ->
      _.extend(@, Backbone.Events)

    registered: []

    register: (el) ->
      $this = $(el).addClass('sqwidget')
      opts = @getWidgetParams($this)
      pkg = el: $this, opts: opts
      _.extend(pkg, Backbone.Events)
      @registered.push(pkg)

      throw new Error("No widget source") unless opts.url

      # Widgets are pre-packaged, so we just load the rjs optimized source
      require ["#{opts.url}.js"], (container) =>
        require ["index"], (module) =>
          # 'settings' object defines all the settings that were passed in via the
          # embed code.
          widget = new module.Controller({settings: opts, sqwidget: @, el: $this})
          pkg.instance = widget
          # fire a 'rendered' method so that the widget can do any post-render
          # operations that it needs to do.
          #widget.view.trigger("rendered")
          pkg.trigger("rendered")
          @trigger("rendered:#{widget.id || opts.url}")

      return pkg

    # returns an array of all the custom widget parameters. The new keys are
    # lowercase concatenated attributes from the embed code with 'data-sqwidget-'
    # removed.
    #
    # eg:
    #     'data-sqwidget-color="#F00" -> `data['color'] = '#F00'`
    #     'data-sqwidget-bg-color='#FFF' -> data['bgcolor'] = '#FFF'
    #
    getWidgetParams: ($el) ->
      data = {}
      for key, val of $el.data()
        key = key.replace("sqwidget", "").toLowerCase()
        data[key || "url" ] = val
      data


