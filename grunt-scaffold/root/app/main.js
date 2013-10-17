require({
  baseUrl: 'lib',
  paths: {
    'src': '../src',
  },
  map: {
    '*': {
      'css': 'require-css/css',
      'less': 'require-less/less'
      //'is': 'require-is/is',
      //'cs': 'require-coffee/cs'
    }
  }
}, ['src/index']);
