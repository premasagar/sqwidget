define([
  'require',
  'i18n!./nls/strings',
  'css!compiled/css/main.css',
  'rv!templates/index.html'
], function(require, strings, css, template ) {
  return {
    Controller: function(opts) {
      this.view = new Ractive({
        el: opts.config.el,
        template: template,
        data: { message: strings.hello + " World" }
      });
    }
  };
});
