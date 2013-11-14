//outer define is namespaced and passed the contextualised require
sqwidget.define(["require"], function(require) {
  var define = sqwidget.define;

  define("dep2/helper", function() {
    return true;
  });

  define("dep2/helper2", function() {
    return true;
  });

  return {};
});

