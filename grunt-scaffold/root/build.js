//requirejs build config (r.js -o build.js)
//
{
  appDir: 'app',
  dir: 'dist',
  mainConfigFile: 'app/main.js',

  // faster build - only minifies layers
  skipDirOptimize: true,
  keepBuildDir: true,

  modules: [
    {
      name: '../main',
      include: ['src/index'],
      excludeShallow: ['css/css-builder', 'less/lessc-server', 'less/lessc']
    }
  ]
}
