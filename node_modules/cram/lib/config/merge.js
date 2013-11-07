/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

(function (define) {
define(function (require) {

	var when, toString, merge;

	when = require('when');
	toString = Object.prototype.toString;

	merge = {
		objects: mergeObjects,
		arrays: mergeArrays,
		isType: isType,
		comparators: {
			byName: compareNames,
			byIdentity: compareDefault
		}
	};

	return merge;

	function mergeObjects (base, ext, levels) {
		var result, p;

		if (levels == null) levels = 0; else --levels;

		result = {};

		for (p in base) {
			result[p] = base[p];
		}

		for (p in ext) {
			if (levels > 0 && isType(result[p], 'Object')) {
				result[p] = mergeObjects(result[p], ext[p], levels);
			}
			else {
				result[p] = ext[p];
			}
		}

		return result;
	}

	/**
	 * This is an O(n*m) operation, but it ensures the following:
	 *   a) the base list preserves its original order
	 *   b) all items in the ext list override base items or are
	 *   appended to base.
	 * @param base {Array}
	 * @param ext {Array}
	 * @param [comparator] {Function} function (a, b) { return 0|-1|1; }
	 * @return {Array}
	 */
	function mergeArrays (base, ext, comparator) {
		var result;

		if (!comparator) comparator = compareDefault;

		result = (base || []).slice();

		ext.forEach(function (item) {
			var pos;
			result.forEach(function (bItem, i) {
				if (comparator(item, bItem) == 0) {
					pos = i;
				}
			});
			if (pos >= 0) result[pos] = item;
			else result.push(item);
		});

		return result;

	}

	function compareDefault (a, b) {
		return a == b ? 0 : a < b ? -1 : 1;
	}

	function compareNames (a, b) {
		return compareDefault(a.id || a.name, b.id || b.name);
	}

	function isType (obj, type) {
		return toString.call(obj).slice(8, -1) == type;
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));