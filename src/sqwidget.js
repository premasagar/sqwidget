define(['require', './core'], function(require, Core) {
  var sqwidget = new Core();
  if(!window._sqwidget) {
    //only clobber global if it doesn't exist
    window._sqwidget = sqwidget;
  }

  require(['domReady!'], function() {
    sqwidget.detectSources();
    sqwidget.initialize();
  });

  return sqwidget;
});
