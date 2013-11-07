(function (define) {
define(function (require) {

	var buster, when, path, reader,
		assert, fail, succeed, resolved, rejected;

	buster = require('buster');
	when = require('when');
	path = require('path');
	reader = require('../../../lib/io/text/fsModule');

	assert = buster.assert;
	fail = buster.assertions.fail;
	succeed = function () { assert(true); };

	resolved = when.resolve;
	rejected = when.reject;

	buster.testCase('io/text/fsModule', {

		'should return an object with a getReader function that returns a function': function (done) {
			assert.equals(reader && typeof reader.getReader, 'function');
			assert.equals(reader && reader.getReader && typeof reader.getReader(), 'function');
			done();
		},
		'should return an object with a getWriter function that returns a function': function (done) {
			assert.equals(reader && typeof reader.getWriter, 'function');
			assert.equals(reader && reader.getWriter && typeof reader.getWriter(), 'function');
			done();
		},
		'should return an object with a closeAll function': function (done) {
			assert.equals(reader && typeof reader.closeAll, 'function');
			done();
		},
		'should load a text file': function (done) {
			var promise;
			try {
				promise = reader.getReader(toAbsPath('../../templates/snippet.html'))();
			}
			catch (ex) {
				fail(ex);
			}
			when(promise).then(
				function (obj) {
					assert.equals(typeof obj, 'string');
					assert.true(obj && /<[^>]+>/.test(obj), 'should have an html tag');
				},
				fail
			).always(done);
		},
		'should fail when attempting to load a missing file': function (done) {
			var promise;
			try {
				promise = reader.getReader(toAbsPath('../../templates/does_not_exist.html'))();
				when(promise).then(fail, succeed).then(done);
			}
			catch (ex) {
				succeed();
				done();
			}
		},
		'//should load a remote url': function (done) {
			done();
		},
		'//should write a text file': function (done) {
			done();
		},
		'//should create a folder structure before writing a file when the folder doesn\'t exist': function (done) {
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