/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function (define) {
define(function (require) {

	var ioText = require('../io/text');

	function fromSource () {
		return function (ctx) {
			// string == plugin urls, which aren't cached
			if (typeof ctx == 'string') return ioText.getReader(ctx)();

			return ioText.getReader(ctx.url)().then(
				function (source) {
					ctx.source = source;
					return ctx;
				}
			);
		};

	}

	return fromSource;

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
