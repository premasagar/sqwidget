/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function (define) {
define(function (require) {

	var when = require('when');
	var merge = require('./config/merge');

	/**
	 * Selects an appropriate grokker and runs it on the supplied filename
	 * @return {Promise} promise for merged configuration
	 */
	function grok (io, filename) {
		return getGrokker(filename).then(function(grokker) {

			return when(grokker(io, filename), function(results) {

				var merged = mergeResults({}, results);

				if (merged.infos && merged.infos.length) {
					merged.infos.forEach(prefixFeedback(filename, io.info));
				}

				if (merged.warnings && merged.warnings.length) {
					merged.warnings.forEach(prefixFeedback(filename, io.warn));
				}

				// TODO: Should this simply reject instead and let the higher level interpret the failure?
				if (merged.errors && merged.errors.length) {
					prefixFeedback(filename, io.error)(merged.errors.join('\n'));
				}

				return merged;

			});

		});
	}

	return grok;

	function prefixFeedback (filename, callback) {
		return function (msg) {
			callback('grokking "' + filename + '": ' + msg);
		}
	}

	function getGrokker(filename) {
		var grokkerId, d;

		// Silly test for now:
		grokkerId = /\.htm[l]?$/i.test(filename) ? './grok/html' : './grok/runjs';

		d = when.defer();
		require([grokkerId], d.resolve, d.reject);

		return d.promise;
	}

	function mergeResults (baseCfg, results) {
		return Array.prototype.reduce.call(results,
			function (base, result) {
				for (var p in result) {
					if (merge.isType(result[p], 'Array')) {
						base[p] = merge.arrays(base[p], result[p]);
					}
					else if (merge.isType(result[p], 'Object')) {
						base[p] = merge.objects(base[p], result[p], 1);
					}
					else {
						base[p] = result[p];
					}
				}
				return base;
			},
			baseCfg || {}
		);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
