/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function (define) {
define(function (require) {

	var path = require('../io/path');
	var ioText = require('../io/text');

	function fromCache (cacheFolder) {
		return function (ctx) {
			var filename, read;

			filename = path.join(cacheFolder, ctx.absId + '.json');
			read = ioText.getReader(filename);

			return read()
				.then(fromString)
				.then(updateContext);

			function updateContext (cachedCtx) {
				// copy properties from cachedCtx to ctx
				for (var p in cachedCtx) {
					if (!(p in ctx)) ctx[p] = cachedCtx[p];
				}
				return ctx;
			}
		};

	}

	return fromCache;

	function fromString (string) {
		return JSON.parse(string);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
