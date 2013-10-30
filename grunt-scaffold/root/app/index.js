define([
  'module',
  './lib/ractive/Ractive',
  'i18n!./nls/strings',
  './plugins/rv!./templates/index.html',
  'css!./compiled/css/main',
], function(module, Ractive, strings, template ) {
  var config = module.config();
  return {
    Views: {},
    Controller: function (opts) {
      this.view = new Ractive({
        el: config.el,
        template: template,
        data: {
          message: strings.hello + " World"
        }
      });
    }
  };
});
