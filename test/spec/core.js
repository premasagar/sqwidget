define(['chai', 'lib/async/lib/async', 'core', 'lib/bonzo/bonzo', 'lib/bean/bean' ], function(chai, async, Core, bonzo, bean) {

  window.sqwidget = {
    define: define,
    require: require
  };

  //TODO: think of a way to inject chai
  var assert = chai.assert;
      sqwidgetCore = new Core();

  describe('Core', function() {
    var w1 = bonzo.create(
      "<div data-sqwidget-test='moo' data-sqwidget='/base/test/fixture/example' data-sqwidget-deep-param='moo'></div>'"
    );

    var w2 = bonzo.create(
      "<div data-sqwidget='/base/test/fixture/promise'></div>'"
    );

    describe('#register()', function() {

      var widget = sqwidgetCore.register(w1);

      it('has been defined an id', function() {
        assert.isDefined(widget.id, widget.id);
      });

      it('should register widget', function() {
        assert.ok(sqwidgetCore.packages[widget.id], "Registered module");
      });

      it('should parse params correctly', function() {
        assert.deepEqual(widget, {
          test: 'moo',
          deep: { param: 'moo' },
          url: '/base/test/fixture/example',
          src: '/base/test/fixture/example.js',
          id: widget.id,
          el: widget.el
        }, "params parsed");
      });

      var w2r = sqwidgetCore.register(w2);
      it('widget 2 parse params correctly', function() {
        assert.deepEqual(w2r, {
          url: '/base/test/fixture/promise',
          src: '/base/test/fixture/promise.js',
          id: w2r.id,
          el: w2r.el
        }, "ok");
      });

      sqwidgetCore.initialize();

      it('should trigger rendered on both widgets', function(done) {

        async.parallel([
          function(cb) {
            bean.on(widget, 'rendered', function() {
              assert.ok("Triggered event on package");
              cb();
            });
          },

          function(cb) {
            bean.on(sqwidgetCore, 'rendered:' + widget.id, function() {
              assert.ok("Triggered event");
              assert.equal(bonzo(w1).html(), '<div>TEST</div>', 'Rendered correctly');
              cb();
            });
          },

          function(cb) {
            bean.on(sqwidgetCore, 'rendered:' + w2r.id, function() {
              assert.ok("Triggered event");
              assert.equal(bonzo(w2).html(), '<div>PROMISE</div>', 'Rendered correctly');
              cb();
            });
          },

        ], done);
      });
    });
  });
});
