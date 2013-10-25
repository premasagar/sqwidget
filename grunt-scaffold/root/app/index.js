define([
  'Ractive',
  'i18n!./nls/strings',
  './plugin/rv!./templates/index.html',
  //'less!../less/main',
], function(Ractive, strings, template ) {

  var module = { views: {} };

  module.Controller = function (opts) {
    this.view = new Ractive({
      el: opts.el,
      template: template,
      data: {
        message: strings.root.hello + " World"
      }
    });
  };

  return module;
});
