require({
  baseUrl: 'app',
  map: {
    '*': {
      Ractive: 'lib/Ractive/Ractive',
      less: 'lib/require-less/less',
      text: 'lib/requirejs-text/text',
      rv: 'lib/requirejs-ractive/rv'
    }
  }
}, ['index']);
