/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * file reader for node.js and ringojs
 */
(function (define, freeRequire) {
define(function (require) {
"use strict";

	var nodeback, when, fs, url, http, path,
		protocol, hasHttpProtocolRx, needsProtocolRx, defaultChannel, files;

	nodeback = require('../nodeback');
	when = require('when');

	// TODO: split this into a fsModule and a httpModule (remote)

	// Note: these are using node/ringo local require
	fs = freeRequire('fs');
	url = freeRequire('url');
	http = freeRequire('http');
	path = freeRequire('path');

	protocol = 'http:';
	hasHttpProtocolRx = /^https?:/;
	needsProtocolRx = /^\/\//;
	defaultChannel = 'main.js';
	files = {};

	return {
		getReader: getReader,
		getWriter: getWriter,
		closeAll: closeAll
	};

	function getReader (path) {
		return function () {
			var dfd = when.defer();
			read(path, dfd.resolve, dfd.reject);
			return dfd.promise;
		};
	}

	function read (urlOrPath, success, fail) {
		if (needsProtocolRx.test(urlOrPath)) {
			// if there's no protocol, use configured protocol (TODO: make it configurable)
			urlOrPath = protocol + urlOrPath;
		}
		if (hasHttpProtocolRx.test(urlOrPath)) {
			loadFileViaNodeHttp(urlOrPath, success, fail);
		}
		else {
			loadLocalFile(urlOrPath, success, fail);
		}
	}

	function loadLocalFile (uri, success, fail) {
		fs.readFile(uri, nodeback(function (contents) {
			success(contents.toString());
		}, function (ex) {
			fail(ex);
		}));
	}

	function loadFileViaNodeHttp (uri, success, fail) {
		var options, data;
		options = url.parse(uri, false, true);
		data = '';
		http.get(options, function (response) {
			response
				.on('data', function (chunk) { data += chunk; })
				.on('end', function () { success(data); })
				.on('error', fail);
		}).on('error', fail);
	}

	function write (optChannelId, text, success, fail) {
		var firstWrite;

		optChannelId = optChannelId || defaultChannel;

		firstWrite = !files[optChannelId];

		// mkdir if necessary
		if (firstWrite) {
			files[optChannelId] = mkdir(path.dirname(optChannelId));
		}

		// create/append to file
		files[optChannelId] = when(files[optChannelId], function () {
			var dfd = when.defer();
			if (firstWrite) {
				fs.writeFile(optChannelId, text, nodeback(dfd.resolve, dfd.reject));
			}
			else {
				fs.appendFile(optChannelId, text, nodeback(dfd.resolve, dfd.reject));
			}
			return dfd.promise;
		}).then(success, fail);
	}

	function getWriter (optChannelId) {

		// returns a write() function that has memoized its file Id
		function writer (text) {
			var dfd = when.defer();
			write(optChannelId, text, dfd.resolve, dfd.reject);
			return dfd.promise;
		}

		writer.close = function () {
			delete files[optChannelId || defaultChannel];
			return when.resolve(true);
		};

		return writer;
	}

	function closeAll () {
		files = {};
	}

	/**
	 * Promise-based "mkdir -p"
	 * @param  {String} folder full path to ensure exists
	 * @return {Promise} promise that fulfills once the full path exists, with
	 *  the full path as the value.
	 */
	function mkdir (folder) {
		var folders;
		// path.relative('', folder) converts to native path separators so
		// that we're splitting on the correct separator, i.e. path.sep
		folders = path.relative('', folder).split(path.sep);
		return when.reduce(folders, function(pathSoFar, folder) {
			var d = when.defer();

			pathSoFar = path.join(pathSoFar, folder);

			fs.mkdir(pathSoFar, function(err) {
				if (err && err.code != 'EEXIST') {
					d.reject(err);
				} else {
					d.resolve(pathSoFar);
				}
			});

			return d.promise;
		}, '');
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); },
	typeof require == 'function' && require
));
