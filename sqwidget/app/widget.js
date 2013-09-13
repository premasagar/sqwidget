requirejs.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});

requirejs(['jquery', 'backbone', 'underscore', 'require'], 
          function($, Backbone, _, require) {

  Sqwidget = window.Sqwidget || {};

  // Extend Backbone widgets to Sqwidget to allow it to be the global message
  // passing system.
  _.extend(Sqwidget, Backbone.Events);

  $(document).ready(function() {
    $('div[data-sqwidget]').each(function(index) {
      var url = $(this).data('sqwidget');
      require([url + "/index.js"], function() {
        console.log('Widget Loaded: ', url);
      });
    });
  });
});
