/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function (define) {
define(function (require) {

	var path = require('../io/path');
	var ioText = require('../io/text');
	var fromCache = require('./fromCache');
	var fromSource = require('./fromSource');

	function fromCacheOrSource (cacheFolder) {
		var tryCache, trySource;

		tryCache = fromCache(cacheFolder);
		trySource = fromSource();

		return function (ctx) {
			// string == plugin urls, which aren't cached
			if (typeof ctx == 'string') return ioText.getReader(ctx)();

			return tryCache(ctx)
				.then(validate)
				.otherwise(getFromSource);

			function validate (ctx) {
				var prevCompileTime, sourceDate;

				// older versions of cram.js didn't cache source, bail
				if (!ctx.source) throw 1;

				prevCompileTime = new Date(ctx.compileTime);
				// older versions of cram didn't record compileTime, bail
				if (!prevCompileTime) throw 1;

				sourceDate = path.lastModified(ctx.url);

				// if cache is stale, bail
				if (sourceDate >= prevCompileTime) throw 1;

				return ctx;
			}

			function getFromSource () {
				return trySource(ctx);
			}

		};

	}

	return fromCacheOrSource;

	function fromString (string) {
		return JSON.parse(string);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
