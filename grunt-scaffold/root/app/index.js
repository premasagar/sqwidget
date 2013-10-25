define([
  'Ractive',
  'i18n!./nls/strings',
  //'rv!templates/index.html',
  //'less!../less/main',
], function(Ractive, strings ) {
  console.log(strings);

  var module = { views: {} };

  //module.Controller = function (opts) {
    //this.view = new Ractive({
      //el: opts.el,
      //template: template,
      //data: {
        //message: lang.hello + " World"
      //}
    //});
  //};

  return module;
});
