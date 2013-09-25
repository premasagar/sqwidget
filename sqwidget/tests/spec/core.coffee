define ['chai', 'jquery', 'component/core'], (chai, $, Core) ->
  assert = chai.assert
  describe 'Core', ->
    sqwidget = new Core()
    src = $("<div data-sqwidget='/base/widgets/test'></div>'")

    describe '#register()', ->
      widget = sqwidget.register(src)

      it 'should register widget', ->
        assert.lengthOf(sqwidget.registered, 1, "Registered module")

      it 'should trigger rendered event', (done) ->
        widget.on 'rendered', ->
          assert.ok "Triggered event"
          done()
