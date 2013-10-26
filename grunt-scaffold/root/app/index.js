define([
  'Ractive',
  './plugin/i18n!./nls/strings',
  './plugin/rv!./templates/index.html',
  'css!./compiled/css/main',
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
