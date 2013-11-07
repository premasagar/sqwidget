/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function(define) {
define(function (require) {

	var when, text, path, grokJsConfig, grokRunJs, findScriptElementsRx, parseAttrsRx, curlName, curlScriptRx;

	when = require('when');
	text = require('../io/text');
	grokJsConfig = require('./jsConfig');
	grokRunJs = require('./runjs');
	path = require('../io/path');

	findScriptElementsRx = /(<\s*script[^>]*>)|(<\/\s*script\s*>)/g;
	parseAttrsRx = /\b([a-zA-Z][a-zA-Z\-:]*)(\s*=\s*(?:['"]([^"']+)['"]|([^\s]+)))?/g;
	curlScriptRx = /curl\.js/i;
	curlName = 'curl';

	function grokHtml (io, filename) {

		return io.readFile(filename).then(function (source) {

			var candidates, relativeLoaderPath, script, attrs, tag, scriptStart, scriptEnd, scriptContent;

			candidates = [];

			findScriptElementsRx.lastIndex = 0;
			parseAttrsRx.lastIndex = 0;

			io.info('Parsing ' + filename + ' for curl configuration');

			while (script = findScriptElementsRx.exec(source)) {
				tag = script[0];
				if (isStartTag(tag)) {
					scriptStart = findScriptElementsRx.lastIndex;

					attrs = parseAttrs(tag);

					if ('data-curl-run' in attrs || 'data-curl-dev' in attrs) {
						captureDataCurlAttr(tag, attrs);
					}
				}
				else {
					// Get the script content
					scriptEnd = findScriptElementsRx.lastIndex - script[0].length;
					scriptContent = source.slice(scriptStart, scriptEnd);

					// See if it might contain curl config info, and if so,
					// try to parse it.
					if (isPotentialCurlConfig(scriptContent)) {
						io.info('Found potential curl config');
						candidates = candidates.concat(grokJsConfig(scriptContent));
					}
				}
			}

			return candidates.length
				? when.all(candidates).then(addLoader)
				: when.reject(new Error('No loader or run.js configuration found: ' + filename + '. Are you missing a data-curl-run attribute?'));

			function captureDataCurlAttr (tag, attrs) {
				var src, run, isCurl, input, output, cfg;

				src = attrs.src;
				run = attrs['data-curl-run'];
				isCurl = src && curlScriptRx.test(src);

				// check if run is a csv of two module ids
				run = run && String(run).split(/\s*,\s*/);

				// warn for "common" mistakes
				if (!src) {
					// <script data-curl-run="run.js">
					io.warn('data-curl-run script must have a src attribute: ' + tag);
				}
				else if (!run && isCurl) {
					// <script data-curl-run src="curl.js">
					io.warn('data-curl-run script must have a value when used with a loader: ' + tag);
				}
				else if (run && !isCurl) {
					// <script data-curl-run="run" src="run.js">
					io.warn('data-curl-run script must not have a value when used with a run module: ' + tag);
				}
				else if (run && run.length > 2) {
					io.warn('data-curl-run can have at most 2 module ids: ' + run);
				}
				else {
					io.info('Found data-curl-run: ' + (run || src));

					if (isCurl) {
						// <script data-curl-run="bundle,run" src="curl.js">
						// <script data-curl-run="run" src="curl.js">
						output = run.length > 1 ? run.shift() : run[0];
						input = run[0];
						if (output == src) captureLoaderPath(src);
					}
					else {
						// <script data-curl-run src="run.js">
						output = src;
						input = src;
					}

					if (output == input) output = insertCramInfix(output);
					cfg = grokConfig(input).then(function (cfg) {
						cfg[0].appRoot = makePath('');
						cfg[0].output = output;
						return cfg;
					});

				}

				if (cfg) {
					candidates = candidates.concat(cfg);
				}
			}

			function captureLoaderPath (relativePath) {
				io.info('Including loader: ' + relativePath);
				if (relativeLoaderPath) {
					io.warn('Multiple loaders found: "' + relativeLoaderPath + '" and "' + relativePath + '"');
				}
				relativeLoaderPath = relativePath;
			}

			function addLoader (configs) {
				if (configs.length) {
					configs[0].loader = relativeLoaderPath;
				}
				return configs;
			}

			function grokConfig (relativePath) {
				return when(grokRunJs(io, makePath(relativePath)), function (configs) {
					// TODO: this is weird that we have to put the run.js module at the top of the file this way
					if (configs[0] && configs[0].runjsIsModule) {
						if (!configs[0].config.preloads) configs[0].config.preloads = [];
						configs[0].config.preloads.unshift(relativePath);
					}
					return configs;
				});
			}

			function makePath (suffix) {
				return path.join(path.dirname(filename), suffix);
			}

		});
	}

	return grokHtml;

	function isStartTag (tag) {
		return tag[1] != '/';
	}

	function isPotentialCurlConfig (scriptContent) {
		return scriptContent.indexOf(curlName) > -1;
	}

	function parseAttrs (tag) {
		var attrs = {};

		tag.replace(parseAttrsRx, function (str, name, _, val) {
			attrs[name] = val;
			return '';
		});

		return attrs;
	}

	function insertCramInfix (filename) {
		return filename.replace(/(\.js)?$/, '.cram$1');
	}

});
})(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
);
