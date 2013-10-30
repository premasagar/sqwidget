/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function (define, window) {
define(function () {

	// There are very few things declared at this scope to prevent pollution
	// of the eval() in scopedEval(): window, document, curl().
	var curl, define;

	// mock window, if necessary
	if (!window) window = {};


	return (function (scopedEval) {
		/**
		 * @function grokJsConfig
		 * @param source {String}
		 * @return {Object}
		 *
		 * @description Records the invocations of curl() inside an app bootstrap
		 * file, such as the run.js file in cujo bootstrap.  (This file is
		 * typically called "main.js" in the RequireJS world.)
		 *
		 * This function can also detect when the file/source configures curl
		 * by declaring a global object, `curl`.  A run.js file should never do
		 * this, but allows us to reuse this function to parse the contents of
		 * script elements in an html file.
		 *
		 * TODO: more intelligent handling of multiple calls to curl.  The current
		 * implementation concatenates all modules together and combines all
		 * configs together via prototypal inheritance.  Doing it this way is
		 * probably all wrong since the most likely use case for multiple
		 * configurations will be to load one set of modules with one
		 * configuration and then load another set using a second config.  However,
		 * this is a very rare scenario so we should probably just signal as
		 * error if the config is called multiple times.
		 */
		return function grokJsConfig (source) {
			var config, errors,
				prevWindowCurl, saveCurl, prevDefine, results;

			results = [];

			// these will be collected by the mock curl API
			config = null;
			errors = [];

			// save any existing curl and define
			prevWindowCurl = window.curl;
			prevDefine = window.define;

			// create mock curl that will collect calls to it
			window.curl = saveCurl = curl = mockCurlApi();

			// mock define() to prevent calls back into curl.js in memory now
			window.define = define = mockDefine;
			window.define.amd = {}; // for UMD sniffs

			try {
				// evaluate source file
				scopedEval.call(window, source);
			}
			catch (ex) {
				errors.push(ex);
			}
			finally {
				// if user set window.curl = { <config> }, capture that here
				curl = window.curl;
				// restore
				window.curl = prevWindowCurl;
				window.define = prevDefine;
			}

			if (errors.length == 0) {
				// check if curl variable was set and if it's a config object.
				// (if config is set, then curl() was called)
				if (!config && curl != saveCurl && isObjectLiteral(curl)) {
					config = curl;
				}
				// if nothing was captured, consider it a failure.
				if (!config && results.length == 0) {
					errors.push(new Error('No configuration or modules included.'));
				}
			}

			collectConfig(config, null, null, errors);

			return results;

			// mock define
			function mockDefine () {
				var args, factory, deps, id, params;

				args = Array.prototype.slice.call(arguments);
				factory = args.pop();
				deps = args.pop();
				id = '';
				params = [];

				// check if this define is named
				if (typeof deps == 'string') {
					id = deps;
					deps = [];
				}

				if (!id && factory) {
					if (deps && deps.length) {
						if (deps[0] != 'curl' || deps.length > 1) {
							errors.push(new Error('Only "curl" may be specified as a dependency to the run module. Found: ' + deps));
						}
						else {
							params.push(curl);
						}
					}
					factory.apply(this, params);
				}

				// collect anonymous define (should we warn devs if it was named?)
				collectConfig(null, null, null, null, null, [id]);

				// only run this once. other define()s are ignored.
				window.define = define = dummyDefine;
			}

			// mock curl API
			function mockCurlApi () {

				function _curl() {
					var args, config, includes, warnings;

					warnings = [];

					// parse params
					args = Array.prototype.slice.call(arguments);
					if (Object.prototype.toString.call(args[0]) == '[object Object]') {
						config = args.shift();
					}
					if (Object.prototype.toString.call(args[0]) == '[object Array]') {
						includes = args.shift();
					}
					if (typeof args[0] == 'function') {
						warnings.push('Did not inspect code inside `curl()` callback(s).');
					}

					collectConfig(config, includes, warnings);

					return {
						// warn when .then() is called
						then: function (cb, eb) {
							warn('Did not inspect code inside `.then()` callback(s).');
						},
						// warn if .next() is called
						next: function (modules) {
							warn('Did not include any modules mentioned in `.next()`: ' + modules);
						},
						config: function(cfg) {
							collectConfig(cfg);
						}
					};
				}

				_curl.config = function(cfg) {
					collectConfig(cfg);
				};

				return _curl;
			}

			function dummyDefine () {
				warn('Did not inspect code inside subsequent define()s.');
			}

			function collectConfig (config, modules, warnings, errors, infos, defines) {
				results.push({
					config: config || {},
					prepend: [],
					modules: modules || [],
					append: [],
					warnings: warnings || [],
					errors: errors || [],
					infos: infos || [],
					defines: defines || []
				});
			}

			function warn (msg) {
				collectConfig(null, null, [msg]);
			}

			function error (msg) {
				collectConfig(null, null, null, [msg]);
			}

			function info (msg) {
				collectConfig(null, null, null, null, [msg]);
			}
		};

		function isObjectLiteral (thing) {
			return thing && thing.toString() == '[object Object]';
		}
	}(
		// eval() function that runs in the same scope as mocked
		// window, document, and curl vars.
		function () {
			eval(arguments[0]);
		}
	));

});
}(typeof define === 'function'
	? define
	: function (factory) { module.exports = factory(); },
	typeof window != 'undefined' && window || typeof global != 'undefined' && global
));
