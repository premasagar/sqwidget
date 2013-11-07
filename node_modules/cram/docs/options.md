# cram.js Command Line Options

cram.js has three modes of command-line operation:

1. HTML auto-configuration via [Code Inference](concepts.md#code-inference)
1. run.js auto-configuration via [Code Inference](concepts.md#code-inference)
1. Manual configuration

## HTML auto-configuration

If your server-side environment allows you to place your HTML documents in a
static location, you may be able to use Code Inference on your HTML file(s)
directly.  In its simplest form, the command line looks like this:

```
node path/to/cram client/myapp.html
```

## run.js auto-configuration

If your app's HTML documents are generated dynamically and don't exist at
development time, you can still take advantage of some of cram.js's Code
Inference features.  Point cram at a ["run.js" file](concepts.md#run-js)
and tell cram where to find the app's modules using the `--root`
[command line option](#manual-configuration).

```
node path/to/cram client/myapp/run.js --root client/myapp/
```

## Compile-time Overrides

However, in most situations, you'll want to specify some configuration options
that don't apply to the run-time operation of your application.  These
"compile-time" overrides should be placed in a separate file from your
run-time files.

Here's how you specify an additional overrides file:

```
node path/to/cram client/myapp.html production_build_options.json
```

This is simply a shortcut for the following, more explicit way to specify a
configuration file:

```
node path/to/cram client/myapp.html --config production_build_options.json
```

These files do not need to be strictly JSON.  They can be simple object
literals.

cram.js uses the same config options as curl.js, including `baseUrl`, `main`,
and `paths`, `packages`, `plugins`, and `preloads` with the
following additions and caveats.

* `excludes`: an array of module ids (strings) that should not be bundled
* `excludeRx`: a RegExp (or array of Regexp or array of strings) that may
	also be used to exclude the ids of modules from the bundle
* `paths`, `packages`, `plugins`, and `preloads`: unlike other config options,
these lists are merged with the same lists in earlier config files.
* `apiName`, `apiContext`, `defineName`, and `defineContext`
  are not yet supported.

The caveat to the the merged lists is that it's impossible to remove items
from the lists.  You can, however, remove the entire list by specifying a `null`
value for the config option.  This allows the list to be ignored by cram.js,
but still used by curl.js.

Once you've removed the list, you could include a new one in a subsequent
config file:

```
node path/to/cram client/myapp.html remove_paths.json production.json
```

## Manual configuration

In some cases, cram.js may not properly infer your intentions.  Also, for
advanced applications, you'll need fine-grained control over what cram.js does.
For both of these situations, cram.js looks for a few other options on the
command line.

cram.js supports the following command-line arguments.  In cases where these
conflict with configuration options, the command-line arguments take
precedence.

```
	-? -h --help
		provides this help message.
	-m --main --include
		includes the following file into the bundle.
		You may specify more than one by repeating this option.
	--exclude
		excludes the following file from the bundle.
		You may specify more than one by repeating this option.
	-r --root --appRoot
		specifies the path from the current working directory to
		the effective location of your html documents.  This serves as the
		root of the baseUrl in an AMD configuration.
	-c --config
		specifies an AMD configuration file.
		You may specify more than one by repeating this option.
	-o --output
		specifies the output folder for the generated bundle(s).
	--loader -l
		tells cram to include the following file as an AMD loader.
```
