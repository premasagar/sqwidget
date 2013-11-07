/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function (define) {
define(function (require) {

	var ioText = require('../io/text');

	function toBundle (outputFile) {
		var write;

		write = ioText.getWriter(outputFile);

		// TODO: save previous code block so we can do a better job guarding!
		return function (ctx) {
			return write(guardSource(ctx.output));
		};
	}

	return toBundle;

	function guardSource (source) {
		// ensure that any previous code that didn't end correctly (ends
		// in a comment line without a line feed, for instance) doesn't
		// cause this source code to fail
		if (!source) return source;
		if (!/\n\s*$/.test(source)) source += '\n';
		if (!/^\s*;|^\s*\//.test(source)) source = '\n;' + source;
		return source;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
