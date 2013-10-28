(function () {
  curl.config({
    packages: {
      i18n: { location: './app/plugins', main: 'i18n' },
      curl: { location: './app/lib/curl/src/curl/' },
      sqwidget: { location: 'app', main: 'main' }
    }
  });

  curl(['sqwidget']).then(
    //success
    function(main) { },
    function(err) { console.log("Sqwidget failed to start: " + err); }
  );
}());
