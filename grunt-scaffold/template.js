/*jslint node: true */
"use strict";

exports.description = 'Create a sqwidget compatible widget';

//exports.warnOn = [
  //'Gruntfile.coffee'
//];

exports.template = function(grunt, init, done) {

  init.process({}, [
    // Prompt for these values.
    init.prompt('name'),
    init.prompt('description'),
    init.prompt('version'),
  ], function(err, props) {
    props.keywords = [];
    props.devDependencies = {
      'grunt-bower-requirejs': '~0.7.1',
      'grunt-contrib-requirejs': '~0.4.1',
      'grunt-contrib-jshint': '~0.6.4',
      'grunt-contrib-watch': '~0.5.3',
      'grunt-contrib-clean': '~0.5.0',
      'grunt-contrib-connect': '~0.5.0',
    };

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};

