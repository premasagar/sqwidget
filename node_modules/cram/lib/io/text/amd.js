/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * file reader for amd
 * TODO: cross-domain, too?
 */
(function (define) {
define(function (require) {

	var when = require('when');

	return {
		getReader: function (absIdOrUrl) {
			return function () { return loadText(absIdOrUrl); };
		}
	};

	function loadText (absIdOrUrl) {
		var dfd = when.defer();
		require(['text!' + absIdOrUrl], dfd.resolve, dfd.reject);
		return dfd.promise;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));