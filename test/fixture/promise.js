sqwidget.define(['require', '../../src/lib/when/when'] ,function(require, when) {

  define("main", function() {
    var deferred = when.defer();
    require(['/base/test/fixture/dummy_load.js'], function(dummy) {

      var pkg = {
        Controller: function (opts) {
          opts.config.el.append("<div>PROMISE</div>");
        }
      };

      deferred.resolve(pkg);
    });
    return deferred.promise;
  });
  return {};
});


