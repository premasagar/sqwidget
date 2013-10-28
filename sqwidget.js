(function () {
  curl.config({
    baseUrl: './sqwidget',
    paths: {
      underscore: { location: './app/lib/underscore-amd/underscore' },
      backbone: { location: './app/lib/backbone-amd/backbone' },
      jquery: { location: './app/lib/jquery/jquery' },
    },
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
