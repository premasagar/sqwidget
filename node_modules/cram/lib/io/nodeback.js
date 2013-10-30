/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function (define) {
define(function (require) {

	var slice = Array.prototype.slice;

	function nodeback (success, fail) {
		return function (e) {
			if (e) {
				fail(e);
			}
			else {
				success.apply(this, slice.call(arguments, 1));
			}
		}
	}

	return nodeback;

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
