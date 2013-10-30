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

    //props.devDependencies = {
      //'grunt-contrib-clean': '~0.5.0',
      //'grunt-contrib-connect': '~0.5.0',
    //};

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    //init.writePackageJSON('package.json', props);
    //init.writePackageJSON('app/main.js', props);

    // All done!
    done();
  });

};

