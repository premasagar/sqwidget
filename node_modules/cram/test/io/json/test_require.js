(function (define) {
define(function (require) {

	var buster, when, path, reader,
		assert, fail, succeed, resolved, rejected;

	buster = require('buster');
	when = require('when');
	path = require('path');
	reader = require('../../../lib/io/json/require.js');

	assert = buster.assert;
	fail = buster.assertions.fail;
	succeed = function () { assert(true); };

	resolved = when.resolve;
	rejected = when.reject;

	buster.testCase('io/json/requireReader', {

		'should return an object with a getReader function that returns a function': function (done) {
			assert.equals(reader && typeof reader.getReader, 'function');
			assert.equals(reader && reader.getReader && typeof reader.getReader(), 'function');
			done();
		},
		'should load a json file': function (done) {
			var promise;
			try {
				promise = reader.getReader(toAbsPath('../../data/tinycfg.json'))();
			}
			catch (ex) {
				fail(ex);
			}
			when(promise).then(
				function (obj) {
					assert.equals(typeof obj, 'object');
					assert.equals(obj && typeof obj.baseUrl, 'string', 'should have a baseUrl string property');
				},
				fail
			).always(done);
		},
		'should load an UMD module': function (done) {
			var promise;
			try {
				promise = reader.getReader(toAbsPath('../../data/tinycfg.js'))();
			}
			catch (ex) {
				fail(ex);
			}
			when(promise).then(
				function (obj) {
					assert.equals(typeof obj, 'object');
					assert.equals(obj && typeof obj.baseUrl, 'string', 'should have a baseUrl string property');
				},
				fail
			).always(done);
		},
		'should fail when attempting to load a missing module': function (done) {
			var promise;
			try {
				promise = reader.getReader('../../data/tinycfg.json')();
				when(promise).then(fail, succeed);
			}
			catch (ex) {
				succeed();
			}
			done();
		},
		'//should load a remote url': function (done) {
			done();
		}

	});

	function toAbsPath (relPath) {
		// Note: this is node-only code
		return path.join(path.dirname(module.filename), relPath);
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));