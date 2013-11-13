//outer define is namespaced and passed the contextualised require
sqwidget.define(["require"], function(require) {

  define("main", function() {
    return {
      Controller: function (opts) {
        opts.config.el.append("<div>TEST</div>");
      },
      require: require
    };
  });

  return {
    packages: [
      { name: "dep1", location: '/base/test/fixture', main:"dep1" },
      { name: "dep2", location: '/base/test/fixture', main:"dep2" }
    ],
    preloads: ["dep1/helper", "dep1/helper2"]
  };
});

