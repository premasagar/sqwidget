define([
  'require',
  'i18n!./nls/strings',
  'css!compiled/css/main.css',
  'rv!templates/index.html'
], function(require, strings, css, template ) {
  return function(opts) {
    var view = new Ractive({
      el: opts.el,
      template: template,
      data: { message: strings.hello + " World" }
    });
  };
});
