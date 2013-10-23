define([
  'Ractive',
  'rv!templates/index.html',
  'less!../less/main',
  'i18n!nls/main',
], function(Ractive, template, less, lang ) {

  var module = { views: {} };

  module.Controller = function (opts) {
    this.view = new Ractive({
      el: opts.el,
      template: template,
      data: {
        message: lang.hello + " World"
      }
    });
  };

  return module;
});
