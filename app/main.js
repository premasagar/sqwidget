define(['./lib/bonzo/bonzo', './lib/qwery/qwery', './lib/eventEmitter/EventEmitter', 'domReady!'],
function(bonzo, qwery, Emitter) {

  var SqwidgetCore = (function() {

    function SqwidgetCore() {}

    for (var key in Emitter.prototype) {
      SqwidgetCore.prototype[key] = Emitter.prototype[key];
    }

    SqwidgetCore.prototype.packages = {};

    //convert data-sqwidget to dictionary
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

    SqwidgetCore.prototype.guid = function() {
      return 'axxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    };

    SqwidgetCore.prototype.register = function(el) {
      var opts, pkg, _this = this, id = this.guid();

      pkg = new Emitter();
      var $el = bonzo(el).addClass('sqwidget').addClass(id);
      pkg.opts = opts = this.getWidgetParams($el);
      opts.el = pkg.el = $el;
      opts.id = id;

      if (!opts.url) {
        throw new Error("No widget source defined (set data-sqwidget-url)");
      }

      this.packages[id] = {
        location: opts.url,
        main: 'app/index',
        config: opts
      };

      return pkg;
    };

    SqwidgetCore.prototype.initialize = function() {
      var names = [], pkg, _this = this;

      for(var k in _this.packages) names.push(k);

      curl({
        packages: _this.packages,
      }, names, function() {
        var loaded = Array.prototype.slice.call(arguments);
        for (var i = 0; i < loaded.length; i++) {
          var module = loaded[i];

          if(module.Controller) {
            var widget = new module.Controller({
              sqwidget: _this
            });

            //bus events
            _this.trigger("rendered:" + _this.packages[names[i]].location);
            _this.trigger("rendered:" + _this.packages[names[i]].id);
          } else {
            console.log("controller not found for " + module.location);
          }
        }
      });
    };

    return SqwidgetCore;

  })();

  sqwidget = new SqwidgetCore();

  bonzo(qwery('div[data-sqwidget]')).each(function(el) {
    sqwidget.register(el);
  });

  sqwidget.initialize();

  return sqwidget;
});
