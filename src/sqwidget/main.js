define(['lib/bonzo/bonzo', 'lib/qwery/qwery',
        'lib/EventEmitter/EventEmitter', 'domReady!'],
function(bonzo, qwery, Emitter) {

  var SqwidgetCore = (function() {

    function SqwidgetCore() {}

    SqwidgetCore.prototype.registered = [];

    SqwidgetCore.prototype.register = function(el) {
      var $this, opts, pkg, _this = this;

      $this = bonzo(el).addClass('sqwidget');
      opts = this.getWidgetParams($this);
      pkg = new Emitter();
      pkg.el = $this;
      pkg.opts = opts;

      this.registered.push(pkg);

      if (!opts.url) {
        throw new Error("No widget source");
      }

      curl(["" + opts.url + ".js"], function(promise) {
        return promise.then(
          function(module) {
            console.log(module);
            if(module.Controller) {
              var widget = new module.Controller({
                settings: opts, sqwidget: _this, el: $this
              });

              pkg.instance = widget;
              pkg.trigger("rendered");
              _this.trigger("rendered:" + (widget.id || opts.url));
            } else {
              console.log("controller not found for " + opts.url);
            }
          }, function(err) {
            console.log("failed to initialise " + opts.url);
          }
        );
      });
      return pkg;
    };

    SqwidgetCore.prototype.getWidgetParams = function($el) {
      var data, key, val, _ref;
      data = {};
      _ref = $el.data();

      for (key in _ref) {
        val = _ref[key];
        if (!(key.match("sqwidget"))) {
          continue;
        }
        key = key.replace("sqwidget", "").toLowerCase();
        data[key || "url"] = val;
      }
      return data;
    };
    for (var key in Emitter.prototype) {
      SqwidgetCore[key] = Emitter.prototype[key];
    }
    return SqwidgetCore;

  })();

  sqwidget = new SqwidgetCore();
  bonzo(qwery('div[data-sqwidget]')).each(function(el) {
    sqwidget.register(el);
  });
  return sqwidget;
});
