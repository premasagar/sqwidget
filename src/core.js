define(['require', 'lib/youarei/src/youarei', 'lib/bonzo/bonzo',
        'lib/qwery/qwery', 'lib/bean/bean', 'domReady!'],
function(require, YouAreI, bonzo, qwery, bean) {

  function SqwidgetCore() {
    this.eventBus = this.curryBean();
  }

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

    //TODO: allow multiple loads of the same source
    return this.packages[opts.id] = opts;
  };

  //provide a curried bean.
  SqwidgetCore.prototype.curryBean = function() {
    var _this = this,
        bus = {},
        proxy = ['fire', 'on', 'off', 'once'];

    for (var i = 0; i < proxy.length; i++) {
      var n = proxy[i];
      (function(n, _this) {
        bus[n] = function(event, cb) { return bean[n](_this, event, cb); };
      }(n, _this));
    }
    return bus;
  };

  //when the promise is resolved initialise the bundle controller
  SqwidgetCore.prototype.initialiseWidget = function(pkg, bundle) {

    //run the bundles returned bootstrap
    if(typeof bundle === 'function') {
      var res = bundle({
        sqwidget: this,
        url: new YouAreI(pkg.url),
        el: pkg.el,
        id: pkg.id,
        config: pkg
      });

      //bus events
      bean.fire(this, "rendered." + pkg.url, [res]);
      bean.fire(this, "rendered." + pkg.id, [res]);

    } else {
      throw("bundle should return a function to bootstrap: " + pkg.url);
    }
  };

  SqwidgetCore.prototype.detectSources = function() {
    var _this = this;
    bonzo(qwery('div[data-sqwidget]')).each(function(el) {
      _this.register(el);
    });
    return _this.packages;
  };

  SqwidgetCore.prototype.initialize = function() {

    var sq_this = this;
    for(var id in this.packages) {

      (function(pkg, id, _this) {
        //parse out script name from path
        var parts = pkg.url.split("/");
        var name = "./" + parts.pop();
        var path = parts.join("/");

        var bundle_require = sqwidget.require.config({
          context: id,
          baseUrl: path
        });

        bundle_require(["require", name], function(require, bundle_config) {
          //the outer bundle can define some config, like packages it would like
          //loading before running its 'main' function

          //load the 'main' function inside the widget bundle when we have
          //finished with dependencies

          var loadMain = function() {
            require(["main"], function(loaded) {
              //if the bundle is a promise, wait for it to resolve, otherwise handle
              //immediately
              if("then" in loaded) {
                var resolve = function(bundle) {
                  _this.initialiseWidget.apply(sq_this, [pkg, bundle]); };
                loaded.then(resolve);
              } else {
                _this.initialiseWidget.apply(sq_this, [pkg, loaded]);
              }
            }, function(err) { throw err; } );
          };

          // preload a library the widget bundle requires
          if(bundle_config && bundle_config.packages) {

            //create a new config for the lib loader
            var package_require = sqwidget.require.config({
              context: id,
              packages: bundle_config.packages,
              paths: bundle_config.paths,
            });

            var package_names = ["require"];
            for(var i=0; i < bundle_config.packages.length; i++) {
              package_names.push(bundle_config.packages[i].name);
            }

            package_require(package_names, function(req) {

              //optimization - currently the main bundle has to fully load
              //before any mixins - we could do a tiny wrapper that returns
              //config allowing both to be loaded simultaneously

              var preloads = bundle_config.preloads || [];
              //at the moment the bundle config passes things we need to preload
              //however, since its an optimized bundle they are *all* loaded
              //already they are just sat inside registry()
              //we could iterate context.registry() instead to force them into
              //the current require context
              require(preloads,function() { loadMain(); });

            }, function(err) { throw err; } );
          } else {
            loadMain();
          }

        }, function(err) {
          //ignore errors from loader so other widgets can continue to load
          if(window.console) { console.log("Didn't load " + pkg.url + ": " + err); }
        } );
      })(this.packages[id], id, this);
    }
  };

  return SqwidgetCore;

});
