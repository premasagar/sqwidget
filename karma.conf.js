module.exports = function(config) {
  config.set({
    // set pre-processors to empty since karma has stupid defaults
    preprocessors: { },
    basePath: '.',
    files: [
      { pattern: 'src/**/*.js', included: false },
      { pattern: 'test/spec/**/*.js', included: false },
      { pattern: 'test/fixture/*.js', included: false },
      {pattern: 'node_modules/karma-chai-plugins/node_modules/chai/chai.js', included: false},
      'test/test-main.js'
    ],
    //exclude: ['test/spec/xxx.js'],
    frameworks: ['mocha', 'requirejs'],

    // Enable or disable watching files and executing the tests
    // whenever one of these files changes.
    autoWatch: false,
    // Chrome (comes installed with Karma)
    // ChromeCanary (comes installed with Karma)
    // PhantomJS (comes installed with Karma)
    // Firefox (requires karma-firefox-launcher plugin)
    // Opera (requires karma-opera-launcher plugin)
    // Internet Explorer (requires karma-ie-launcher plugin)
    // Safari (requires karma-safari-launcher plugin)
    browsers: ['PhantomJS'],
    // If singleRun is set to true, Karma will start and capture all
    // configured browsers, run tests and then exit with an exit code of 0 or 1.
    singleRun: false,
    reporters: 'dots'
  });
};
