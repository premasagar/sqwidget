/** @license MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * cram (cujo resource assembler)
 * An AMD-compliant javascript module optimizer.
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function (global, globalDefine, globalLoader, define, args) {
define(function (require) {
/*global environment:true*/
'use strict';

	var config, cramFolder, curl,
		defaultExcludes,
		undef;

	defaultExcludes = { 'curl': true, 'curl/_privileged': true };

	try {

		// parse the arguments sent to this file
		args = parseArgs(args);

		// find cram folder (the folder with all of the javascript modules)
		cramFolder = args.cramFolder;
		if (cramFolder && /^\.\.\//.test(cramFolder)) {
			cramFolder = joinPaths(currDir(), cramFolder);
		}
		if (!cramFolder) cramFolder = cramDir();

		config = {
			paths: {
				curl: joinPaths(cramFolder, 'amd_modules/curl/src/curl')
			},
			packages: {
				cram: {
					location: cramFolder,
					main: './cram'
				},
				when: {
					location: joinPaths(cramFolder, 'amd_modules/when'),
					main: 'when'
				}
			},
			preloads: [
				'cram/lib/has'
			]
		};

		if (!global.curl) {
			globalLoader(joinPaths(config.paths.curl, '../../dist/curl-for-ssjs/curl.js'));
		}
		// curl global should be available now
		if (!global.curl) {
			throw new Error('curl() was not loaded.');
		}
		curl = global.curl;

		// configure curl
		curl.config(config);

		// run!
		curl(
			[
				'when',
				'when/sequence',
				'cram/lib/compile',
				'cram/lib/link',
				'cram/lib/read/fromCacheOrSource',
				'cram/lib/write/toBundle',
				'cram/lib/write/toCache',
				'cram/lib/transform/amdToSimplifiedAmd',
				'cram/lib/ctx',
				'cram/lib/grok',
				'cram/lib/io/text',
				'cram/lib/io/json',
				'cram/lib/config/merge',
				'cram/lib/log'
			],
			start,
			fail
		);

	}
	catch (ex) {
		fail(ex);
	}

	// TODO: return API
	// return api(io);

	function start(when, sequence, compile, link, fromCacheOrSource, writeToBundle, writeToCache, transform, getCtx, grok, ioText, ioJson, merge, log) {
		var cramSequence, grokked, configs;

		grokked = {};
		configs = [];

		if (args.grok) {
			grokked = grok(
				{
					readFile: function (filename) {
						return ioText.getReader(filename)();
					},
					warn: log.warn,
					info: log.info,
					error: fail
				},
				args.grok
			);
		}

		if (args.configFiles) {
			configs = when.map(args.configFiles, function (file) {
				return ioJson.getReader(joinPaths(currDir(), file))();
			});
		}

		cramSequence = sequence.bind(undef, [
			function (buildContext) {
				buildContext.ctx = getCtx('', buildContext.config);
				return buildContext;
			},
			function (buildContext) {
				if (buildContext.preloads  && buildContext.preloads.length > 0) {
					log.info('Compiling preloads');
					return compile(
						log,
						fromCacheOrSource('.cram/meta'),
						fromCacheOrSource('.cram/meta'),
						writeToCache('.cram/meta'),
						buildContext.io.collect
					)(buildContext.ctx, buildContext.preloads);
				}
			},
			function (buildContext) {
				log.info('Compiling modules');
				return compile(
					log,
					fromCacheOrSource('.cram/meta'),
					fromCacheOrSource('.cram/meta'),
					writeToCache('.cram/meta'),
					buildContext.io.collect
				)(buildContext.ctx, buildContext.modules);
			},
			function (buildContext) {
				if (buildContext.prepend.length > 0) {
					log.info('Writing prefix');
					return writeFiles(buildContext.prepend, buildContext.io, buildContext.ctx);
				}
			},
			function (buildContext) {
				log.info('Linking');
				return link(
					function readFromMemory (ctx) { return ctx; },
					writeToBundle(buildContext.config.output),
					transform
				)(buildContext.discovered);
			},
			function (buildContext) {
				if (buildContext.append.length > 0) {
					log.info('Writing suffix');
					return writeFiles(buildContext.append, buildContext.io, buildContext.ctx);
				}
			},
			function (buildContext) {
				log.info('Bundle written to ' + buildContext.config.output);
			}
		]);

		when.join(grokked, configs)
			.spread(mergeConfigsOntoGrokResults)
			.then(processGrokResults)
			.then(createBuildContext)
			.then(cramSequence)
			.then(cleanup, fail);

		function mergeConfigsOntoGrokResults (grokResults, configs) {
			var mergedProps, grokCfg;

			// these are merged. all others are overwritten
			mergedProps = { paths: 1, packages: 1, plugins: 1, excludes: 1, excludeRx: 1 };

			grokCfg = grokResults.config = Array.prototype.reduce.call(configs,
				function (base, ext) {
					for (var p in ext) {
						if (p in mergedProps) {
							// merge by type
							if (merge.isType(ext[p], 'Array')) {
								// sniff the first item to determine which comparator to use
								if (merge.isType(ext[p][0], 'Object')) {
									base[p] = merge.arrays(configThingToArray(base[p]), ext[p], merge.comparators.byName);
								}
								else {
									base[p] = merge.arrays(configThingToArray(base[p]), ext[p], merge.comparators.byIdentity);
								}
							}
							else if (merge.isType(ext[p], 'Object')) {
								base[p] = merge.objects(configThingToObject(base[p]), ext[p], 1);
							}
							else if (ext[p] == null) {
								// remove/undefine
								delete base[p];
							}
							else {
								// overwrite (i.e. "main" when not an array)
								base[p] = ext[p];
							}
						}
						else {
							// everything else is overritten
							base[p] = ext[p];
						}
					}
					return base;
				},
				grokResults.config
			);

			return grokResults;
		}

		function configThingToArray (thing) {
			if (merge.isType(thing, 'Array')) {
				return thing;
			}
			else if (merge.isType(thing, 'Object')) {
				// return an array of named objects
				return Object.keys(thing).map(function (key) {
					if (!thing.name) thing.name = key;
					return thing[key];
				});
			}
			else {
				return [thing];
			}
		}

		function configThingToObject (thing) {
			var isNamedObjectArray, obj;

			isNamedObjectArray = merge.isType(thing, 'Array')
				&& merge.isType(thing[0], 'Object')
				&& (thing[0].name || thing[0].id);

			if (isNamedObjectArray) {
				// convert to hash of objects
				return thing.reduce(function (obj, item) {
					obj[item.id || item.name] = item;
					return obj;
				}, {});
			}
			else {
				return thing;
			}
		}

		function processGrokResults (results) {
			var config, appRoot, loader;

			config = results.config;

			if (!config.baseUrl) config.baseUrl = '';
			if (!results.modules) results.modules = [];
			if (config.includes) results.modules = results.modules.concat(config.includes);
			if (args.includes) results.modules = results.modules.concat(args.includes);
			if (!results.excludes) results.excludes = [];
			if (config.excludes) results.excludes = results.excludes.concat(config.excludes);
			if (args.excludes) results.excludes = results.excludes.concat(args.excludes);
			if (!results.excludeIds) results.excludeIds = defaultExcludes;
			if (!results.excludeRx) results.excludeRx = [];
			if (config.excludeRx) results.excludeRx = results.excludeRx.concat(config.excludeRx);

			// figure out where modules are located
			appRoot = args.appRoot || results.appRoot;
			if (appRoot) {
				log.info('`appRoot` resolved to', appRoot);
				config.baseUrl = joinPaths(appRoot, config.baseUrl);
			}
			if (config.baseUrl == '') config.baseUrl = './';
			if (/^\./.test(config.baseUrl)) {
				config.baseUrl = joinPaths(currDir(), config.baseUrl);
			}
			log.info('`baseUrl` resolved to', config.baseUrl);

			loader = args.loader || results.loader;
			config.output = ensureDotJs(args.output || results.output || '.cram/linked/bundle.js');
			log.info('`output` resolved to', config.output);

			// remove things that curl will try to auto-load
			if (config.main) {
				results.modules = results.modules.concat(config.main);
				delete config.main;
			}
			if (config.preloads) {
				results.preloads = config.preloads;
				delete config.preloads;
			}

			// convert excludes array to excludeIds hashmap
			results.excludes.forEach(function (exclude) {
				results.excludeIds[exclude] = true;
			});

			// convert config.excludeRx RegExp/string array to RegExp array
			results.excludeRx = results.excludeRx
				.map(function (rx) {
					return typeof rx == 'string' ? new RegExp(rx) : rx;
				});

			if (loader) {
				log.info('Loader to be bundled:', loader);
				results.prepend.unshift(ioText.getReader(loader)());
			}

			// configure curl
			// TODO: put this in its own step rather than a side-effect here
			curl(config);

			return results;
		}

		function createBuildContext (results) {
			var discovered = [];

			return {
				config: results.config,
				prepend: results.prepend,
				preloads: results.preloads,
				modules: results.modules,
				append: results.append,
				// collect modules encountered, in order
				// dual array/hashmap
				discovered: discovered,

				// compile phase:
				// transform it to AMD, if necessary
				// scan for dependencies, etc.
				// cache AST here
				io: {
					readFile: function (filename) {
						return ioText.getReader(filename)();
					},
					readModule: function (ctx) {
						return ioText.getReader(ctx.withExt(ctx.toUrl(ctx.absId)))();
					},
					writeModule: function (ctx, contents) {
						return ioText.getWriter(results.config.output)(guardSource(contents));
					},
					readMeta: function (ctx) {
						return ioText.getReader(joinPaths('.cram/meta', ctx.absId + '.json'))();
					},
					writeMeta: function (ctx, contents) {
						return ioText.getWriter(joinPaths('.cram/meta', ctx.absId + '.json'))(contents);
					},
					collect: function (id, thing) {
						var top, skip;
						skip = (id in discovered)
							|| (id in results.excludeIds)
							|| results.excludeRx.some(function (rx) {
								return rx.test(id);
							});
						if (skip) return;
						top = discovered.length;
						discovered[id] = top;
						discovered[top] = thing;
					},
					info: log.info,
					warn: log.warn,
					error: fail
				}
			};
		}

		function writeFiles (files, io, ctx) {
			return when.reduce(files, function(_, file) {
				return io.writeModule(ctx, file);
			}, undef);
		}

		function cleanup () {
			return ioText.closeAll && ioText.closeAll();
		}
	}

	function guardSource (source) {
		// ensure that any previous code that didn't end correctly (ends
		// in a comment line without a line feed, for instance) doesn't
		// cause this source code to fail
		if (!source) return source;
		if (!/\n\s*$/.test(source)) source += '\n';
		if (!/^\s*;|^\s*\//.test(source)) source = '\n;' + source;
		return source;
	}

	/**
	 * Processes command-line arguments.
	 * @param args {Array}
	 * @return {Object}
	 */
	function parseArgs (args) {
		var optionMap, arg, option, result, log;

		optionMap = {
			'-m': 'includes',
			'--main': 'includes',
			'--include': 'includes',
			'--exclude': 'excludes',
			'-r': 'appRoot',
			'--root': 'appRoot',
			'--appRoot': 'appRoot',
			'-c': 'configFiles',
			'--config': 'configFiles',
			'-o': 'output',
			'--output': 'output',
			'--loader': 'loader',
			'-l': 'loader',
			'-s': 'cramFolder',
			'--src': 'cramFolder',
			'-?': 'help',
			'-h': 'help',
			'--help': 'help'
		};

		// defaults
		result = {
			appRoot: '',
			output: '',
			configFiles: [],
			includes: [],
			excludes: []
		};

		log = console.log.bind(console);

		if (!args.length) {
			help(log, optionMap); quitter();
		}

		// pop off an arg and compare it to list of known option names
		while ((arg = args.shift())) {

			option = optionMap[arg];

			// check if the first arg is a run.js file to grok
			if (arg.charAt(0) != '-' && !('grok' in result)) {
				result.grok = arg;
			}
			else {
				if (!('grok' in result)) result.grok = false;
				// check if arg is a config file or option
				if (arg.charAt(0) != '-') {
					// this must be a config file
					result.configFiles.push(arg);
				}
				else if (option == 'help') {
					help(log, optionMap); quitter();
				}
				else if (!option) {
					throw new Error('unknown option: ' + arg);
				}
				else if (result[option] && result[option].push) {
					// array. push next arg onto array
					result[option].push(args.shift());
				}
				else {
					// grab next arg as value of option
					result[option] = args.shift();
				}
			}

		}
		return result;
	}

	function joinPaths (path1, path2) {
		var args;

		args = Array.prototype.slice.apply(arguments);

		return args.reduce(joinTwo, '');

		function joinTwo (path1, path2) {
			if (path2.substr(0, 2) == './') path2 = path2.substr(2);
			if (path1 && path1.substr(path1.length - 1) != '/') {
				path1 += '/';
			}
			return path1 + path2;
		}
	}

	function cramDir () {
		var dir;
		if (typeof __dirname != 'undefined') {
			dir = __dirname;
		}
		else if (typeof module != 'undefined' && module.uri) {
			// remove file: protocol and trailing file name
			dir = module.uri.replace(/^file:|\/[^\/]*$/g, '')  + '/';
		}
		else {
			throw new Error('Could not determine cram\'s working directory.');
		}
		return dir;
	}

	function currDir () {
		var curdir;
		curdir = typeof environment != 'undefined' && 'user.dir' in environment
			? environment['user.dir']
			: typeof process != 'undefined' && process.cwd && process.cwd();
		if (curdir == undef) {
			throw new Error('Could not determine current working directory.');
		}
		return curdir;
	}

	function ensureDotJs (filename) {
		return filename.slice(-3) == '.js' ? filename : filename + '.js';
	}

	function fail (ex) {
		console.log('cram failed: ', ex && ex.message || ex);
		if (ex && ex.stack) console.log(ex.stack);
		quitter(1);
	}

	function quitter (code) {
		if (typeof process !== 'undefined' && process.exit) {
			process.exit(code);
		}
		else if (typeof quit == 'function') {
			quit(code);
		}
		else {
			throw "quitting";
		}

	}

	function help (write, optionsMap) {
		var skipLine, header, usage, autoGrok, footer, multiOptionText, helpMap;

		skipLine ='\n\n';
		header = 'cram, an AMD-compatible module bundler. An element of cujoJS.';
		usage = 'Usage:\n\t\t`node cram.js [options]`\n\tor\t`ringo cram.js [options]`\n\tor\t`cram [options] (if installed globally)';
		autoGrok = 'Auto-grok run.js (app bootstrap) file:\n\t\t`cram index.html build_override.json [options]`\n\tor\t`cram run.js build_override.json -root path/to/modules [options]`';
		footer = 'More help can be found at http://cujojs.com/';
		multiOptionText = 'You may specify more than one by repeating this option.';

		helpMap = {
			'help': {
				help: 'provides this help message.'
			},
			'includes': {
				help: 'includes the following file into the bundle.\n'
					+ multiOptionText
			},
			'excludes': {
				help: 'excludes the following file from the bundle.\n'
					+ multiOptionText
			},
			'appRoot': {
				help: 'specifies the path from the current working directory to \n'
					+ 'the effective location of your html documents.  This serves as the \n'
					+ 'root of the baseUrl in an AMD configuration.'
			},
			'configFiles': {
				help: 'specifies an AMD configuration file. \n' + multiOptionText
			},
			'output': {
				help: 'specifies the output folder for the generated bundle(s).'
			},
			'loader': {
				help: 'tells cram to include the following file as an AMD loader.'
			},
			'cramFolder': {
				help: 'tells cram where its source files are. DEPRECATED'
			}
		};

		helpMap = fillHelpMap(helpMap, optionsMap);

		write(
			header + skipLine +
			usage + skipLine +
			autoGrok + skipLine +
			helpMapToText(helpMap) + skipLine +
			footer
		);

		function fillHelpMap (helpMap, optionsMap) {
			var p, option, helpItem;

			for (p in optionsMap) {
				option = optionsMap[p];
				helpItem = helpMap[option];
				if (helpItem) {
					if (!helpItem.commands) helpItem.commands = [];
					helpItem.commands.push(p);
				}
			}

			return helpMap;
		}

		function helpMapToText (helpMap) {
			var output, p;
			output = 'Options:\n';
			for (p in helpMap) {
				// options line
				output += '\t' + helpMap[p].commands.join(' ') + '\n';
				// indented, descriptive text
				output += '\t\t' + helpMap[p].help.replace(/\n/g, '\n\t\t') + '\n';
			}
			return output;
		}

	}

});
}(
	typeof global != 'undefined' ? global : this,
	typeof define == 'function' && define.amd ? define : function (factory) { module.exports = factory(require); },
	typeof curl == 'function' && curl || typeof require == 'function' && require,
	typeof define == 'function' && define.amd || function (factory) { module.exports = factory(require); },
	typeof process != 'undefined' && process.argv ? process.argv.slice(2) : Array.prototype.slice.apply(arguments)
));
