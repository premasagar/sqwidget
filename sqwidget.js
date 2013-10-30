(function () {
  curl.config({
    //this needs to be configurable.
    baseUrl: './sqwidget',
    //Optional dependencies which aren't anonymous. AMD is crazy.
    //preloads: ['curl/plugin/css','curl/plugin/i18n', 'curl/plugin/domReady'],
    paths: {
      underscore: { location: './app/lib/underscore-amd/underscore' },
      backbone: { location: './app/lib/backbone-amd/backbone' },
      jquery: { location: './app/lib/jquery/jquery' },
      moment: { location: './app/lib/momentjs/moment' },
    },
    preloads: ['i18n'],
    packages: {
      i18n: { location: './app/plugins', main: 'i18n' },
      curl: { location: './app/lib/curl/src/curl/' },
      sqwidget: { location: './app', main: 'main' }
    }
  });

  curl(['sqwidget']).then(
    //success
    function(main) { },
    function(err) { console.log("Sqwidget failed to start: " + err); }
  );
}());
