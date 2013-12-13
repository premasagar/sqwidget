define(['require', './core'], function(require, Core) {
  var sqwidget = new Core();
  if(!window._sqwidgetCore) {
    //only clobber global if it doesn't exist
    window._sqwidgetCore = sqwidget;
  }

  require(['domReady!'], function() {
    sqwidget.detectSources();
    sqwidget.initialize();
  });

  return sqwidget;
});
