require({
  baseUrl: 'src',
  paths: { },
  map: {
    '*': {
      css: 'require-css/css',
      less: 'require-less/less'
    }
  }
}, ['src/index']);
