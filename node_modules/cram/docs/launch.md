# Application Launch

cram uses [Code Inference](concepts.md#code-inference) on both HTML files and
Javascript files to determine the files and configuration needed to create
your web app.  By searching for calls to curl.js inside the files that launch
your application, cram can typically figure out everything it needs to know
to build your app into a single AMD bundle.

curl.js can be configured in a few ways and in a few places:
1. inside the HTML
1. in an AMD module (a.k.a. "run module" -- **preferred!**)
1. in a non-modular Javascript file (a.k.a. "run.js file")

## HTML configuration

For simple applications, it can be convenient to keep the configuration in the
application's HTML file(s).  cram can scan an HTML file for `script` elements
and use Code Inference on scripts that call or load curl.js.  In an HTML file,
there are a few ways to configure curl:

1. with a global configuration object defined before curl.js is loaded
1. by calling curl() or curl.config() with an object literal

### Global configuration object in HTML

In the following HTML snippet, cram will recognize that curl will load and
run 'wire!app/main' to launch the application.  cram will walk the dependency
graph of 'wire!app/main', bundling all of its dependencies into a single
AMD bundle.

```html
<script>
var curl = {
	baseUrl: 'client/',
	packages: [
		{ name: 'wire', location: 'lib/wire', main: './wire' },
		{ name: 'curl', location: 'lib/curl/src/curl', main: '../curl' },
		{ name: 'myapp', location: 'app' }
	],
	main: 'wire!app/main'
};
</script>
<script src="client/lib/curl/src/curl.js"></script>
```

### Configuring via curl() or curl.config()

You can load curl first and then configure it as follows. cram will also
recognize this configuration pattern and will build a single AMD bundle.

```html
<script src="client/lib/curl/src/curl.js"></script>
<script>
curl.config({
	baseUrl: 'client/',
	packages: [
		{ name: 'wire', location: 'lib/wire', main: './wire' },
		{ name: 'curl', location: 'lib/curl/src/curl', main: '../curl' },
		{ name: 'myapp', location: 'app' }
	],
	main: 'wire!app/main'
});
</script>
```

## Run module configuration

Using an AMD module to configure curl.js is more flexible than configuring
inside HTML.  You may use either an anonymous AMD module or a named one.

### Anonymous run module

Here's a simple example of an anonymous run module:

```js
// client/app/run
define(['curl'], function (curl) {
	curl.config({
		baseUrl: 'client/',
		packages: [
			{ name: 'wire', location: 'lib/wire', main: './wire' },
			{ name: 'curl', location: 'lib/curl/src/curl', main: '../curl' },
			{ name: 'myapp', location: 'app' }
		]
	});
	curl(['wire!app/main']).then(function () {
		document.documentElement.className = 'app-loaded';
	});
});
```

Anonymous run modules can be loaded using a single script element by using
curl's `data-curl-run` HTML attribute.  cram will create an
[integrated bundle](#integrated-bundles) that embeds curl.js when it
encounters this pattern:

```html
<script data-curl-run="client/app/run" src="client/lib/curl/src/curl.js"></script>
```

# Named run module

A named run module is similar to an anonymous one, but allows more options.
The main difference between an anonymous and a named module is the inclusion
of the module's id as the first parameter to `define()`.  Note: since
curl hasn't been configured yet*, the run module's id has to include the full
path from the HTML file:

```js
define('client/app/run', function (['curl'], function (curl) {
	curl.config({
		baseUrl: 'client/',
		packages: [
			{ name: 'wire', location: 'lib/wire', main: './wire' },
			{ name: 'curl', location: 'lib/curl/src/curl', main: '../curl' },
			{ name: 'myapp', location: 'app' }
		]
	});
	curl(['wire!app/main']).then(function () {
		document.documentElement.className = 'app-loaded';
	});
});
```

Named run modules can be used with either two script elements or a single script
element:

```html
<script src="client/lib/curl/src/curl.js"></script>
<script data-curl-run src="client/app/run.js"></script>
```

```html
<script data-curl-run="client/app/run" src="client/lib/curl/src/curl.js"></script>
```

Note in the two-script pattern, the `data-curl-run` attribute has no value.
(If you were to specify a value here, curl would attempt to load the module
named by that value!)  In the single-script pattern, the `data-curl-run`
attribute specifies the id of the run module.  Since curl hasn't been
configured, yet, the module id is the full path of the file without the ".js"
extension.

With the single-script pattern, cram will create a single,
[integrated bundle](#integrated-bundles).  However, cram will create an
[AMD bundle](#amd-bundles) if it finds the two-script pattern.

* It's possible to pre-configure curl by declaring a global curl object
as in the HTML examples above.  You could then omit the path information
from the name of the run module, but this is totally unnecessary in almost
all cases.

## Run.js file configuration

If run.js is not an AMD module, it could use the global curl() function to
configure and load an application.  Here's a very simple run.js file that
uses the global curl function:

```js
// client/app/run.js
curl.config({
	baseUrl: 'client/',
	packages: [
		{ name: 'wire', location: 'lib/wire', main: './wire' },
		{ name: 'curl', location: 'lib/curl/src/curl', main: '../curl' },
		{ name: 'myapp', location: 'app' }
	]
});
curl(['wire!app/main']).then(function () {
	document.documentElement.className = 'app-loaded';
});
```

A run.js file should only be used with a two-script element launch pattern,
not a single-script pattern:

```html
<script src="client/lib/curl/src/curl.js"></script>
<script data-curl-run src="client/app/run.js"></script>
```

cram will create an [AMD bundle](#amd-bundles) in this case.
