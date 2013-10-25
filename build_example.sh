#!/bin/bash

rm -Rf example-widget
mkdir example-widget
cd example-widget
../node_modules/grunt-init/bin/grunt-init ../grunt-scaffold --yes
npm install
bower install
grunt build
