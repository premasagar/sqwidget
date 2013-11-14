sqwidget.define(['require', '../../src/lib/when/when'] ,function(require, when) {

  define("main", function() {
    var deferred = when.defer();
    require(['/base/test/fixture/dummy_load.js'], function(dummy) {

      var pkg = function(opts) {
        opts.el.append("<div>PROMISE</div>");
        return { require: require };
      };

      deferred.resolve(pkg);
    });
    return deferred.promise;
  });

  return {
    packages: [
      { name: "dep2", location: '/base/test/fixture', main:"dep2" }
    ],
    preloads: ["dep2/helper", "dep2/helper2"]
  };
});


