(function () {
  curl.config({
    //this needs to be configurable.
    baseUrl: './sqwidget',
    //Optional dependencies which aren't anonymous. AMD is crazy.
    //preloads: ['curl/plugin/css','curl/plugin/i18n', 'curl/plugin/domReady'],
    paths: {
      underscore: { location: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.2.1/lodash.underscore.min.js' },
      backbone: { location: './app/lib/backbone-amd/backbone' },
      jquery: { location: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js' },
      moment: { location: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.min.js' },
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
