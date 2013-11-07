/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function (define) {
define(function (require) {

	var when = require('when');

	return {
		getReader: function (absIdOrUrl) {
			return isJsonFile(absIdOrUrl)
				? function () { return loadJson(absIdOrUrl); }
				: function () { return loadModule(absIdOrUrl); };
		}
	};

	function loadJson (absIdOrUrl) {
		var dfd = when.defer();
		require(['json!' + absIdOrUrl], dfd.resolve, dfd.reject);
		return dfd.promise;
	}

	function loadModule (absIdOrUrl) {
		var dfd = when.defer();
		require(absIdOrUrl, dfd.resolve, dfd.reject);
		return dfd.promise;
	}

	function isJsonFile (filename) {
		// parens to appease jshint
		return (/\.json$/).test(filename);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));