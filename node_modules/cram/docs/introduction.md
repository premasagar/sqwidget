# Introduction

cram.js is [cujoJS](http://cujojs.com)'s [AMD](concepts.md#amd) module
bundler.

cram.js concatenates the modules of your application into larger
[bundles](concepts.md#optimization-and-bundles) that may be loaded much more
efficiently than when loaded as separate modules.  cram.js can create AMD-
compatible bundles that may be loaded by an AMD loader, such as
[curl.js](https://github.com/cujojs/curl) or bundles with an integrated loader.

As you'd expect, cram.js works with
[AMD modules](https://github.com/amdjs/amdjs-api/wiki/AMD) as well as raw
[CommonJS Modules](http://wiki.commonjs.org/wiki/Modules/1.1).  It can also
bundle *non-module* resources like HTML templates, CSS stylesheets, i18n
bundles via plugins -- and even more powerful things such as
[wire.js](https://github.com/cujojs/wire) specs.

cram.js does this in an intuitive way that doesn't require an apprenticeship in
sorcery or require sacrificial chickens.  Simple tasks are simple.  Complex
tasks are possible.

## Installation

See the [README](../README.md) file for installation instructions.

## Features

cram.js offers:

* Out-of-the-box, no-configuration operation for simple applications
* Transparency and helpful feedback
* High performance operation

Web apps built with cram.js enjoy:

* All-in-one bundling of Javascript, CSS, and HTML
* Efficient, non-blocking loading of bundles
* Just-in-time loading of bundles*

\* Plugins are excluded from bundles, by default.  You should include them
using cram.js's "includes" option if your bundles will fetch additional,
plugin-based resources at run time.

cram.js does *not* provide:

* Code Minification or obfuscation. Use Google Closure Compiler, UglifyJS, etc.
  *after* running cram.js, **not before**.
* ES6 or TypeScript modules compatibility (yet).
* Separate bundles for Javascript, HTML, and CSS (yet).

## Examples

Tell cram.js to inspect the main page of an app that uses a static index.html
file:

```
node path/to/cram mywebapp/index.html build-options.json
```

Instruct cram.js to inspect the run.js file (the AMD configuration file) of a
web app that does not use a static html file:

```
node path/to/cram mywebapp/ mywebapp/run.js build-options.json
```

Explicitly direct cram.js to create a bundle using options from a JSON file:

```
node path/to/cram --config build-options.json --include mywebapp/curl/src/curl.js --output mywebapp/app.js
```

Using node/npm, you can install cram globally via `npm install -g cram`.  This
allows you to just execute cram from anywhere like this:

```
cram mywebapp/index.html build-options.json
```
