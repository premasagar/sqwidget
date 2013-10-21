define([
  'Ractive',
  'rv!templates/index.html',
  'less!../less/main'
], function(Ractive, template, less ) {

  var module = { views: {} };

  module.Controller = function (opts) {
    this.view = new Ractive({
      el: opts.el,
      template: template,
      data: {
        message: "Hello World"
      }
    });
  };

  return module;
});
