/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function (define) {
define(function (require) {

	return function locate (fileCtx) {
		if (!fileCtx.pluginId) {
			fileCtx.url = fileCtx.withExt(fileCtx.require.toUrl(fileCtx.absId));
		}
		return fileCtx;
	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
