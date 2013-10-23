require({
  baseUrl: 'app',
  map: {
    '*': {
      Ractive: 'lib/Ractive/Ractive',
      less: 'lib/require-less/less',
      text: 'lib/requirejs-text/text',
      i18n: 'lib/requirejs-i18n/i18n',
      rv: 'lib/requirejs-ractive/rv'
    }
  }
}, []);
