//outer define is namespaced and passed the contextualised require
sqwidget.define(["require"], function(require) {

  define("main", function() {
    return function (opts) {
      opts.el.append("<div>TEST</div>");
      return { require: require };
    };
  });

  return {
    packages: [
      { name: "dep1", location: '/base/test/fixture', main:"dep1" },
      //relative dependency
      { name: "dep2", location: '.', main:"dep2" }
    ],
    preloads: ["dep1/helper", "dep1/helper2"]
  };
});

