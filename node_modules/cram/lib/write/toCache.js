/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function (define) {
define(function (require) {

	var path = require('../io/path');
	var ioText = require('../io/text');

	function toCache (cacheFolder) {
		return function (ctx) {
			var filename, write;
			filename = path.join(cacheFolder, ctx.absId + '.json');
			write = ioText.getWriter(filename);
			return write(filename, toString(ctx));
		};
	}

	return toCache;

	function toString (fileCtx) {
		var stringable, p;
		stringable = {};
		for (p in fileCtx) {
			// don't write out functions or config
			if (typeof fileCtx[p] != 'function' && p != 'config') {
				stringable[p] = fileCtx[p];
			}
		}
		return JSON.stringify(stringable);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
