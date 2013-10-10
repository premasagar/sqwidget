requirejs.config({
  paths: {
    jquery: '../../../lib/jquery/jquery',
    underscore: '../../../lib/underscore-amd/underscore',
    backbone: '../../../lib/backbone-amd/backbone'
  }
});

define(['underscore', 'backbone'], function(_, Backbone) {
  var module = {
    views: {}
  };

  module.Controller = (function() {

    function Controller(opts) {
      opts.el.append("<div>TEST</div>");
    }

    return Controller;

  })();
  return module;
});
