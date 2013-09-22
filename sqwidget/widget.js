requirejs.config({
  paths: {
    require: 'lib/require',
    jquery: 'lib/jquery',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    ractive: 'lib/ractive'
  },
  shim: {
    'jquery': {
      exports: '$'
    },
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

requirejs(['jquery', 'underscore', 'backbone', 'require', 'ractive', 'app/resources'], 
          function($, _, Backbone, require, Ractive, resources) {

  Sqwidget = window.Sqwidget || {};

  // Extend Backbone widgets to Sqwidget to allow it to be the global message
  // passing system.
  _.extend(Sqwidget, Backbone.Events);

  $(document).ready(function() {
    $('div[data-sqwidget]').each(function(index) {
      var $this = $(this);
      var url = $this.data('sqwidget');
      $this.addClass('sqwidget');
      require([url + "/index.js"], function(widget) {
        console.log('Widget Loaded: ', url);
      });
    });
  });
});
