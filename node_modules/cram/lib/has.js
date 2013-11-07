/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

/**
 * lightweight has() implementation for cram
 */
(function (define, freeRequire) {
define(function (require) {
	"use strict";

	var features;

	features = {};

	// preload some feature tests
	features.amd = !!define.amd;
	features.freeRequire = typeof freeRequire == 'function';
	features['require-async'] = features.amd || (features.freeRequire && freeRequire.length > 1);
	features['require-sync'] = features.freeRequire && !features['require-async'];

	// TODO: remove this if it's not needed for ringojs
	features.readFile = typeof readFile == 'function';

	// TODO: why isn't require.extensions showing up in ringojs?
	features['require-json'] = features.freeRequire && freeRequire.extensions && '.json' in freeRequire.extensions;
	features.json = typeof JSON != 'undefined';

	// TODO: not sure we need this any more (ringojs supports fs and path modules)
	features.java = typeof java != 'undefined';
	// features.java = ({}).toString.call(global.java) == '[object JavaPackage]';

	// ringojs and node file system apis
	features.fs = hasModule('fs');
	features.path = hasModule('path');

	function has (feature) {
		return features[feature];
	}

	// Note: this is not exactly the same as has.js's add() method, but that's ok
	has.add = function (name, value) {
		features[name] = value;
	};

	return has;

	/* helpers */

	function hasModule (id) {
		// relies on sync require()
		try {
			return freeRequire && !!freeRequire(id);
		} catch(e) {
			return false;
		}
	}

});
}(
	typeof define == 'function' && define.amd ? define : function (factory) { module.exports = factory(require); },
	typeof require == 'function' && require
));
