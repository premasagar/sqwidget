define(['require', 'lib/bonzo/bonzo', 'lib/qwery/qwery', 'lib/bean/bean', 'domReady!'], function(require, bonzo, qwery, bean) {

  function SqwidgetCore() {}

  SqwidgetCore.prototype.packages = {};

  //convert data-sqwidget to dictionary
  SqwidgetCore.prototype.getWidgetParams = function($el) {
    var key, val,
        data = {},
        elData = $el.data();

    //for compatibility data-sqwidget gets renamed data-sqwidget-url
    if(elData.sqwidget) {
      elData.sqwidgetUrl = elData.sqwidget;
      delete elData.sqwidget;
    }

    //convert list of names into a nested structure with val as the value
    var nest = function( names, val, data ) {
      for( var i = 0; i < names.length; i++ ) {
        data = data[ names[i].toLowerCase() ] =
          i === names.length - 1 ? val : data[ names[i] ] || {};
      }
    };

    for (key in elData) {
      val = elData[key];
      if (!(key.match("^sqwidget"))) { continue; }
      nest(key.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1), val, data);
    }

    return data.sqwidget;
  };

  SqwidgetCore.prototype.guid = function() {
    return 'sqwidget-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  SqwidgetCore.prototype.register = function(el) {
    var opts,
        _this = this,
        id = this.guid(),
        $el = bonzo(el).addClass('sqwidget').addClass(id);
    opts = this.getWidgetParams($el);
    opts.el = $el;
    opts.id = id;
    opts.src = opts.url + ".js";

    if (!opts.url) {
      throw new Error("No widget source defined (set data-sqwidget-url)");
    }

    //TODO: allow multiple loads of the same source
    return this.packages[opts.id] = opts;
  };

  //when the promise is resolved initialise the bundle controller
  SqwidgetCore.prototype.resolve = function(pkg, bundle) {
    if(bundle.Controller) {
      var widget = new bundle.Controller({
        sqwidget: this,
        config: pkg
      });

      //bus events
      bean.fire(this, "rendered:" + pkg.url);
      bean.fire(this, "rendered:" + pkg.id);
      bean.fire(pkg, "rendered");
    } else {
      throw("controller not found for " + bundle.location);
    }
  };

  SqwidgetCore.prototype.detectSources = function() {
    var _this = this;
    bonzo(qwery('div[data-sqwidget]')).each(function(el) {
      _this.register(el);
    });
  };

  SqwidgetCore.prototype.initialize = function() {
    var names = [],
        _this = this;

    for(var id in _this.packages) {
      var pkg = _this.packages[id];
      (function(pkg) {
        require([pkg.src], function(loaded) {

          //if the bundle is a promise, wait for it to resolve, otherwise handle
          //immediately

          if("then" in loaded) {
            var resolve = function(bundle) { return _this.resolve.apply(_this, [pkg, bundle]); };
            loaded.then(resolve);
          } else {
            _this.resolve(pkg, loaded);
          }
        }, function(err) { throw err; } );
      })(pkg);
    }
  };

  return SqwidgetCore;

});
