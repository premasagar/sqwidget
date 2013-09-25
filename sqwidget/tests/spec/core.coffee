define ['chai', 'jquery', 'component/core'], (chai, $, Core) ->
  assert = chai.assert
  describe 'Core', ->
    sqwidget = new Core()

    describe '#register()', ->
      it 'should register widget', ->
        sqwidget.register($("<div data-sqwidget='test'></div>'"))
        assert.lengthOf(sqwidget.registered, 1, "Registered module")
