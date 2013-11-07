(function (define) {
define(function (require) {
var buster, assert, refute, fail, nodeback;

buster = require('buster');
assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

nodeback = require('../../lib/io/nodeback');

buster.testCase('nodeback', {

	'should export a function': function () {
		assert(typeof nodeback == 'function');
	},
	'should return a function': function () {
		assert(typeof nodeback() == 'function');
	},
	'should call errback if first argument is not undefined/null': function () {
		var errback, callback;
		errback = this.spy();
		callback = this.spy();
		nodeback(callback, errback)(true);
		assert.calledOnceWith(errback, true);
	},
	'should call callback if first argument is undefined/null': function () {
		var errback, callback;
		errback = this.spy();
		callback = this.spy();
		nodeback(callback, errback)(null, true);
		assert.calledOnceWith(callback, true);
	}

});

});
})(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
);
