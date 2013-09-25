define [], () ->

  class SqwidgetCore
    constructor: () ->

    registered: []

    register: (el) ->
      $this = $(el).addClass('sqwidget')
      pkg = el: $this
      @registered.push(pkg)
      opts = @getWidgetParams($this)

      throw new Error("No widget source") unless opts.url

      # we're expecting an 'index.js' file inside every widget.
      require ["#{opts.url}/js/index.js"], (module) ->
        # 'settings' object defines all the settings that were passed in via the
        # embed code.
        widget = new module.Controller({settings: opts})
        pkg.widget = widget
        $this.html(widget.view.el)
        # fire a 'rendered' method so that the widget can do any post-render
        # operations that it needs to do.
        widget.view.trigger("rendered")


    # returns an array of all the custom widget parameters. The new keys are
    # lowercase concatenated attributes from the embed code with 'data-sqwidget-'
    # removed.
    #
    # eg:
    #     'data-sqwidget-color="#F00" -> `data['color'] = '#F00'`
    #     'data-sqwidget-bg-color='#FFF' -> data['bgcolor'] = '#FFF'
    #
    getWidgetParams: ($el) ->
      data = []
      for key, val of $el.data()
        key = key.replace("sqwidget", "").toLowerCase()
        data[key || "url" ] = val
      data


