define(['require', './lib/bonzo/bonzo', './lib/qwery/qwery', 'bean', 'curl/plugin/domReady!'],
function(require, bonzo, qwery, bean) {

  var SqwidgetCore = (function() {

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

      if (!opts.url) {
        throw new Error("No widget source defined (set data-sqwidget-url)");
      }

      return this.packages[opts.url] = opts;
    };

    //when the promise is resolved initialise the bundle controller
    SqwidgetCore.prototype.resolve = function(pkg, bundle) {
      if(bundle.Controller) {
        var widget = new bundle.Controller({
          sqwidget: this,
          config: pkg
        });

        //bus events
        bean.fire(this, "rendered:" + pkg.location);
        bean.fire(this, "rendered:" + pkg.id);
        bean.fire(pkg, "rendered");
      } else {
        throw("controller not found for " + bundle.location);
      }
    };

    SqwidgetCore.prototype.initialize = function() {
      var names = [],
          _this = this;

      for(var k in _this.packages) names.push(k);

      require(names, function() {
        var loaded = Array.prototype.slice.call(arguments);
        for (var i = 0; i < loaded.length; i++) {
          var pkg =  _this.packages[names[i]];
          //if the bundle is a promise, wait for it to resolve, otherwise handle
          //immediately
          if("then" in loaded[i]) {
            var resolve = function(bundle) {
              return _this.resolve(pkg, bundle); };
            loaded[i].then(resolve);
          } else {
            _this.resolve(pkg, loaded[i]);
          }
        }
      }, function(err) { throw err; } );
    };

    return SqwidgetCore;

  })();

  var sqwidget = new SqwidgetCore();

  bonzo(qwery('div[data-sqwidget]')).each(function(el) {
    sqwidget.register(el);
  });

  sqwidget.initialize();
  return sqwidget;
});
