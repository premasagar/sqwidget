# cram.js

## cujoJS resource assembler

See the docs/ folder for instructions and useful information.

## Installation

### node.js

```
npm install --save cram
```

To run cram from any folder:

```
npm install --global cram
```

### Bower

TBD

## Release notes

0.7.7

* Lots of fixes to the code that groks html files.
* Internal refactoring and reorganization

0.7.6

* Use same logic as curl.js when assigning configuration to modules that
  may be loaded by a plugin or module loader.
* Add a legacy loader example.
* Stop detecting code such as `goog.require('id')` as a CommonJS-style
  `require('id')`.

0.7.5

* Improve support for i18n and CommonJS modules via curl.js 0.8
* Improve module parsing (fixes some issues with lodash).
* Parse literal RegExps better.
* Include simple example apps.
* Find build override json files without absolute paths.
* Fix many other minor things.
