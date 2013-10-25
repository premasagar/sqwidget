define([], function () {
  return curl({
    packages: {
      "{%= name %}": { location: '/{%= name %}/app', main: 'index' },
      "Ractive": { location: '/{%= name %}/app/lib/ractive', main: 'Ractive' }
    }
  }, ['{%= name %}']).then(
    //success
    function(main) { },
    function(err) { console.log("Error running widget " + err); }
  );
});
