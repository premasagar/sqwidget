/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function (define) {
define(function (require) {

	var when, grokJsConfig, hasJsExtRx;

	when = require('when');
	grokJsConfig = require('./jsConfig');

	hasJsExtRx = /\.js$/;

	return function (io, filename) {
		var fullname = ensureJsExt(filename);
		return io.readFile(fullname).then(function (contents) {
			return when(grokJsConfig(contents), function (configs) {
				var runjsIsModule;
				// search for an anonymous define()
				configs.some(function (config) {
					config.defines = config.defines.filter(function (define) {
						// anonymous module indicates run.js is a module
						runjsIsModule = define == '';
						// don't include the anonymous define()
						return !runjsIsModule;
					});
					return runjsIsModule !== undefined;
				});
				if (configs.length) {
					if (runjsIsModule) {
						// preload the run.js module
						configs[0].runjsIsModule = true;
					}
					else {
						// include run.js text in output
						configs[0].prepend.push(contents);
					}
				}

				return configs;
			});
		});
	};

	function ensureJsExt (filename) {
		return hasJsExtRx.test(filename) ? filename : filename + '.js';
	}


});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
