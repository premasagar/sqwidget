(function (define) {
define(function (require) {
var buster, assert, refute, fail, merge;

buster = require('buster');
assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

merge = require('../../lib/config/merge');

buster.testCase('cram/lib/config/merge', {

	'should return an object with helper functions': function () {
		assert.isObject(merge);
		assert.isFunction(merge.objects);
		assert.isFunction(merge.arrays);
		assert.isFunction(merge.isType);
	},

	'should return some simple comparators': function () {
		assert.isObject(merge.comparators);
		assert.isFunction(merge.comparators.byName);
		assert.isFunction(merge.comparators.byIdentity);
	},

	'objects': {
		'should create an object from two object': function () {
			assert.isObject(merge.objects({}, {}));
		},
		'should add new properties in second object to those in first object': function () {
			var obj1, obj2;
			obj1 = { id: 1 };
			obj2 = { foo: 2 };
			assert.equals(merge.objects(obj1, obj2), { id: 1, foo: 2 });
		},
		'should prefer properties from second object over those in first object': function () {
			var obj1, obj2;
			obj1 = { id: 1 };
			obj2 = { id: 2 };
			assert.equals(merge.objects(obj1, obj2), { id: 2 });
		},
		'should merge nested objects up to the specified level': function () {
			var obj1, obj2;
			obj1 = { foo: { bar: 42 } };
			obj2 = { foo: { baz: 27 } };
			assert.equals(merge.objects(obj1, obj2, 2), { foo: { bar: 42, baz: 27 } });
		},
		'should merge nested objects no higher than specified level': function () {
			var obj1, obj2;
			obj1 = { foo: { bar: 42 } };
			obj2 = { foo: { baz: 27 } };
			assert.equals(merge.objects(obj1, obj2, 1), { foo: { baz: 27 } });
		},
		'should not merge nested arrays': function () {
			var obj1, obj2;
			obj1 = { foo: [ 1, 2, 3 ] };
			obj2 = { foo: [ 4, 5 ] };
			assert.equals(merge.objects(obj1, obj2), { foo: [ 4, 5 ] });
		}
	},

	'isType': {
		'should match first argument\'s constructor name to second argument': function () {
			assert(merge.isType('', 'String'));
			assert(merge.isType(-5, 'Number'));
			assert(merge.isType(false, 'Boolean'));
			assert(merge.isType(new String(''), 'String'));
			assert(merge.isType(new Number(-5), 'Number'));
			assert(merge.isType(new Boolean(false), 'Boolean'));
			assert(merge.isType(new Date(), 'Date'));
			assert(merge.isType([], 'Array'));
			assert(merge.isType({}, 'Object'));
			assert(merge.isType(null, 'Null'));
			assert(merge.isType(void 0, 'Undefined'));
		}
	},

	'arrays': {
		'should create an array from two arrays': function () {
			assert.isArray(merge.arrays([], []));
		},
		'should add new values in second array to those in first array': function () {
			var obj1, obj2, obj3, arr1, arr2, merged;
			obj1 = { id: 1 };
			obj2 = { id: 2 };
			obj3 = { id: 3 };
			arr1 = [obj1, obj2];
			arr2 = [obj3];
			merged = merge.arrays(arr1, arr2);
			assert.equals(merged, [obj1, obj2, obj3]);
		},
		'should not duplicate values that are in both arrays': function () {
			var obj1, obj2, obj3, arr1, arr2, merged;
			obj1 = { id: 1 };
			obj2 = { id: 2 };
			obj3 = { id: 3 };
			arr1 = [obj1, obj2];
			arr2 = [obj1, obj3];
			merged = merge.arrays(arr1, arr2);
			assert.equals(merged, [obj1, obj2, obj3]);
		},
		'should work with array items that are primitives': function () {
			var arr1, arr2, merged;
			arr1 = [1, 2];
			arr2 = [2, 3];
			merged = merge.arrays(arr1, arr2);
			assert.equals(merged, [1, 2, 3]);
		},
		'should work with supplied byName comparator': function () {
			var arr1, arr2, merged;
			arr1 = [{ id: 1 }, { id: 2 }];
			arr2 = [{ id: 1 }, { id: 3 }];
			merged = merge.arrays(arr1, arr2, merge.comparators.byName);
			assert.equals(merged, [{ id: 1 }, { id: 2 }, { id: 3 }]);
		},
		'should preserve array order': function () {
			var arr1, arr2, merged;
			arr1 = [99, 2];
			arr2 = [2, 33];
			merged = merge.arrays(arr1, arr2);
			assert.equals(merged, [99, 2, 33]);
		},
		'should work with user-supplied comparator': function () {
			var arr1, arr2, merged;
			arr1 = [{ foo: 3 }, { foo: 2 }];
			arr2 = [{ foo: 3 }, { foo: 1 }];
			merged = merge.arrays(arr1, arr2, c);
			assert.equals(merged, [{ foo: 3 }, { foo: 2 }, { foo: 1 }]);
			function c (a, b) { return a.foo == b.foo ? 0 : a.foo > b.foo ? 1 : -1 }
		}
	}

});

});
})(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
);
