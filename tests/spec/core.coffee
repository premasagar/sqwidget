define ['chai', 'bonzo', 'component/core'], (chai, bonzo, Core) ->
  assert = chai.assert
  describe 'Core', ->
    sqwidget = new Core()
    src = bonzo.create("<div data-sqwidget-test='moo' data-sqwidget='/base/dist/test'></div>'")

    describe '#register()', ->
      widget = sqwidget.register(src)

      it 'should register widget', ->
        assert.lengthOf(sqwidget.registered, 1, "Registered module")

      it 'should parse params correctly', ->
        assert.deepEqual( widget.opts, { test: 'moo', url: '/base/dist/test' } , "params parsed")

      it 'should trigger rendered event', (done) ->
        widget.on 'rendered', ->
          assert.ok "Triggered event"
          assert.equal(bonzo(src).html(),
            '<div>TEST</div>'
            'Rendered correctly'
          )
          done()

