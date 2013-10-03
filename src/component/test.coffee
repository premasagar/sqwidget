define ['component/core', 'jquery'], (Core, $) ->
  sqwidget = new Core()

  return el: (el) ->
    #add el to body
    $el = $(el)
    $('body').append($el)
    sqwidget.register($el)
