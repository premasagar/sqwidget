# cram.js Concepts

## AMD

[Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki) is a
proposed standard file format for writing Javascript modules.  It has built-in
closures to help developers write modular code and has support for
asynchronous loading, which is required in browser environments.

## CommonJS Modules

[CommonJS Modules](http://wiki.commonjs.org/wiki/Modules/1.1) are another
proposed format for Javascript modules. Unlike [amd](#amd), CommonJS modules
don't have built-in closures since they rely on a run-time environment that
limits access to the global object.  They also don't handle asynchrony since
they assume the environment can load modules synchronously.

There are several build tools that can be used to convert CommonJS Modules to
a format suitable for use in a browser.  cram.js can be used for this, too.
For simpler development cycles, [curl.js](https://github.com/cujojs/curl) can
load CommonJS modules without a build step, as well.

## Optimization and Bundles

Small files are much easier to develop and test.  However, large files load
more efficiently over HTTP connections.  The process of optimization is the
conversion of many smaller files to one -- or a small number of -- larger
files.   We call these larger files "bundles".

The smaller files are typically Javascript files, but could also be any
text-based resources such as CSS and HTML files, as well.  Actually, any type
of text file can be used, as long as there's an cram.js plugin for it.
When combined into a bundle, the text based resources are wrapped in an
[AMD](#amd) `define`.

Ideally, all of the Javascript files would be AMD or
[CommonJS modules](#commonjs-modules), but legacy, non-modular Javascript
files are also allowed via the js! plugin.

The simplest approach to bundling would be to create a single bundle that
comprises the entire app -- Javascript, CSS, and HTML.  This is also a very
performant approach for small and medium-sized applications.  However, very
large apps almost always benefit from more sophisticated strategies, involving
many, interdependent bundles.

## AMD Bundles

If a [bundle](#optimization-and-bundles) is reliant on an external [AMD](#amd)
loader, we call it an "AMD Bundle".  To an AMD loader, it looks a lot like an
AMD module with several stowaways.

## Integrated Bundles

An [AMD Bundle](#amd-bundles) may contain run-time configuration or code to
kick-start an application.  If an [AMD](#amd) loader is also included, the
bundle is self-sufficient and no longer needs any type of external loader.

## run.js

One strategy for launching an AMD application is via a Javascript module that
contains configuration and code to kick start the application.  In cujoJS,
we call this a "run module".  However, the actual name of the file doesn't
matter.  During development, the run module is loaded by the browser via a
normal `<script>` element, but during production, the run module may be part
of an [integrated bundle](#integrated-bundles).

## Compile to AMD

Since [AMD](#amd) is such a browser-friendly format, it's convenient to wrap
other types of things in AMD "wrappers".  Many of
[curl.js](https://github.com/cujojs/curl)'s cram plugins use this concept at
build time whenever possible.  For instance, curl's text! plugin takes the
text resource and transforms it to a module that exports a string:

```js
define('myTextResource', function () { return 'text is here'; });
```

curl.js's transforms also use this feature to transform a "foriegn" format,
such as [CommonJS Modules](#commonjs-modules), into AMD.

## Code Inference

It can be a bit of a maintenance hassle to have to keep two different copies of
your application's [AMD](#amd) config: one for the loader and one for the
bundler.  cram.js lets you reuse your loader config even if it's embedded in
an HTML file or a [run.js](#run-js).

cram.js will inspect your HTML and/or Javascript files for configuration
information and modules to run.  These will serve as the base configuration
for building a bundle.  You can override the configuration by providing overrides
to cram like this, for example:

```
node path/to/cram myapp/index.html build_overrides.json
```

Read up on [configuration options](options.md) for more information.
