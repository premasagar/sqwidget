define(['require', 'core'], function(require, Core) {
  var sqwidget = new Core();


  require(['domReady!'], function() {
    sqwidget.detectSources();
    sqwidget.initialize();
  });

  return sqwidget;
});
