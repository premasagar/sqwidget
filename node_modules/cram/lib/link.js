/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function (define) {
define(function (require) {

	var when = require('when');

	function configureLink (read, write, transform) {
		return function link (filesData) {
			// for each file, load its meta data and write its text
			return when.reduce(filesData, function (results, fileCtx) {

				fileCtx.output = transform(read(fileCtx));

				return when(write(fileCtx), function () {
					results.push(fileCtx.absId);
					return results;
				});
			}, []);
		};
	}

	return configureLink;

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
