/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function(define) {
define(function() {

	return {
		join: join,
		dirname: dirname,
		compare: compareUrls
	};

	// FIXME: These are weak. Better implementations please!
	function join() {
		return Array.prototype.join.call(arguments, '/');
	}

	function dirname(path) {
		var idx = path.lastIndexOf('/');
		return idx >= 0 ? path.slice(0, idx) : '';
	}

	function compareUrls () {
		return 0;
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(); }));
