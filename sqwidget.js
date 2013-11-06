(function () {
  curl.config({
    //this needs to be configurable.
    baseUrl: './sqwidget',
    //preloads: ['curl/plugin/css','curl/plugin/i18n', 'curl/plugin/domReady'],
    paths: {
      underscore: { location: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.2.1/lodash.underscore.min.js' },
      bean: { location: '//cdnjs.cloudflare.com/ajax/libs/bean/1.0.3/bean.min.js' },
      moment: { location: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.4.0/moment.min.js' },
    },
    preloads: ['i18n'],
    main: "app/main",
    packages: {
      i18n: { location: './app/plugins', main: 'i18n' },
      curl: { location: './app/lib/curl/src/curl/' },
    }
  });
}());
