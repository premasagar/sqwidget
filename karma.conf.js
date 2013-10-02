// Karma configuration
// Generated on Tue Sep 24 2013 14:30:28 GMT+0100 (BST)

module.exports = function(config) {
  config.set({
    // set pre-processors to empty since karma has stupid defaults
    preprocessors: { },
    // base path, that will be used to resolve files and exclude
    basePath: '.',

    // frameworks to use
    frameworks: ['mocha', 'requirejs'],

    // list of files / patterns to load in the browser
    files: [
      'compiled/tests/js/test-main.js',
      {pattern: 'node_modules/karma-chai-plugins/node_modules/chai/chai.js', included: false},
      {pattern: 'compiled/js/**/*.js', included: false},
      {pattern: 'compiled/tests/js/spec/**/*.js', included: false},
      {pattern: 'lib/**/*.js', included: false, watched: false},
      {pattern: 'widgets/test/**/*.js', included: false, watched: false},
    ],

    // list of files to exclude
    exclude: [ ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
    //'Chrome',
      //,'Firefox'
      'Chrome'
    ],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
  });
};
