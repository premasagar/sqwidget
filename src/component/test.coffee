define ['component/core', 'jquery'], (Core, $) ->
  sqwidget = new Core()

  return el: (el) -> sqwidget.register($(el))
