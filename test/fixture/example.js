//outer define is namespaced and passed the contextualised require
sqwidget.define(["require"], function(require) {

  define("main", function() {
    return {
      Controller: function (opts) {
        opts.config.el.append("<div>TEST</div>");
      }
    };
  });

  return {};
});

