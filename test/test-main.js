var tests = [];
for (var file in window.__karma__.files) {
  if (/spec\//.test(file)) {
    tests.push(file);
  }
}

requirejs.config({
  baseUrl: '/base/src',
  paths: {
    chai: '../node_modules/karma-chai-plugins/node_modules/chai/chai',
    spec: '../test/spec',
    domReady: 'lib/requirejs-domready/domReady'
  },
  deps: tests,
  callback: function() {
    window.sqwidget.define = define;
    window.__karma__.start();
  }
});
