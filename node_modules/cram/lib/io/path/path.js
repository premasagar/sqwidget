/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function(define, freeRequire) {
define(function() {

	var path = freeRequire('path');
	var fs = freeRequire('fs');

	return {
		join: path.join,
		dirname: path.dirname,
		lastModified: getModifiedDate
	};

	function getModifiedDate (filename) {
		try {
			return fs.statSync(filename).mtime;
		}
		catch (ex) {
			if (ex.code == 'ENOENT') return null;
			else throw ex;
		}
	}

});
}(
	typeof define === 'function' ? define : function(factory) { module.exports = factory(); },
	typeof require === 'function' && require
));
