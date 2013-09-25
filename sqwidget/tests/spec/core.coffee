define ['chai', 'jquery', 'component/core'], (chai, $, Core) ->
  assert = chai.assert
  describe 'Core', ->
    sqwidget = new Core()
    src = $("<div data-sqwidget='/base/widgets/hello-world'></div>'")

    describe '#register()', ->
      it 'should register widget', ->
        sqwidget.register(src)
        assert.lengthOf(sqwidget.registered, 1, "Registered module")
