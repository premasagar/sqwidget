sqwidget.define(['require', '../../src/lib/when/when'] ,function(require, when) {

  define("main", function() {
    var deferred = when.defer();
    require(['/base/test/fixture/dummy_load.js'], function(dummy) {

      var pkg = {
        Controller: function (opts) {
          opts.config.el.append("<div>PROMISE</div>");
        },
        require: require
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


