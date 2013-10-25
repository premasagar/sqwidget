define(['lib/bonzo/bonzo', 'lib/qwery/qwery',
        'lib/EventEmitter/EventEmitter', 'domReady!'],
function(bonzo, qwery, Emitter) {

  var SqwidgetCore = (function() {

    function SqwidgetCore() {}

    for (var key in Emitter.prototype) {
      SqwidgetCore.prototype[key] = Emitter.prototype[key];
    }

    SqwidgetCore.prototype.registered = [];

    SqwidgetCore.prototype.register = function(el) {
      var opts, pkg, _this = this;

      pkg = new Emitter();
      pkg.el = bonzo(el).addClass('sqwidget');
      opts = this.getWidgetParams(pkg.el);
      pkg.opts = opts;

      this.registered.push(pkg);

      if (!opts.url) {
        throw new Error("No widget source");
      }

      curl(["" + opts.url + ".js"], function(promise) {
        return promise.then(
          function(module) {
            if(module.Controller) {
              var widget = new module.Controller({
                settings: opts, sqwidget: _this, el: pkg.el
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
    return SqwidgetCore;

  })();

  sqwidget = new SqwidgetCore();
  bonzo(qwery('div[data-sqwidget]')).each(function(el) {
    sqwidget.register(el);
  });
  return sqwidget;
});
