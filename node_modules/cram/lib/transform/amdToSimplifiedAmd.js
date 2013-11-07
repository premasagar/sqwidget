/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

define(function () {

	/**
	 * Normalizes an AMD module to "simplified AMD": the simplest AMD format
	 * for AMD loaders to grok.
	 * 1. Transforms a module by replacing its id with an absolute one, if the
	 * current one is relative or otherwise needs to be normalized/expanded.
	 * 2. Finds r-value require() calls and hoists them to the dependency list.
	 * 3. Ensures that a factory function exists.
	 *
	 * TODO: preserve coding style: quotes, commas, spaces/tabs, etc.
	 * TODO: deplist and requires ids should be normalized before we get here???
	 *
	 * It might be interesting to try to remove "require" from the dependency
	 * list, but we'd have to ensure there are no async require() calls.  We
	 * can't remove "exports" in case the dev is using it to resolve circular
	 * dependencies.
	 *
	 * @param fileCtx {Object} the meta-data for a file. contains the text of
	 *   the file plus one or more objects describing module meta-data...
	 * @return {String} the simplified version of the file.
	 */
	function amdToSimplifiedAmd (fileCtx) {
		var replacements, source, pos;

		// these are the insertion operations to perform on the text
		replacements = [];
		source = fileCtx.source;

		fileCtx.modules.forEach(function (module) {

			// create replacement operation for define
			replacements.push({
				pos: module.pos,
				count: module.count,
				insert: function () {
					return writeDefine(module);
				}
			});

			// create replacement operations for requires
			module.requires && module.requires.forEach(function (req, i) {
				req.varName = idToVar('r', i);
				replacements.push({
					pos: req.pos,
					count: req.count,
					insert: function () {
						return writeRequire(req);
					}
				});
			});

		});

		pos = 0;

		return replacements
			.sort(sortByPos)
			.reduce(function (snippets, replacement) {
				// push preceding part of string
				snippets.push(source.substring(pos, replacement.pos));
				// and replacement string
				snippets.push(replacement.insert());
				// skip over replaced part
				pos = replacement.pos + replacement.count;
				return snippets;
			}, [])
			.concat(source.substr(pos))
			.join('');
	}

	return amdToSimplifiedAmd;

	function idToVar (id, i) {
		return '$cram_' + id + i;
	}

	function writeDefine (module) {
		var depList, argList, requires, reqIds, reqVars;

		depList = module.depList || [];
		argList = module.argList || [];
		requires = module.requires || [];

		if (argList.length > 0 && depList.length == 0) {
			// AMD-wrapped CommonJS
			depList = ['require', 'exports', 'module'].slice(0, argList.length);
		}

		if (argList.length < depList.length) {
			// create placeholders at end
			argList = depList.map(function (dep, i) {
				return i in argList ? argList[i] : idToVar('', i);
			});
		}

		if (requires.length > 0) {
			reqIds = requires.map(function (req) { return req.id; });
			reqVars = requires.map(function (req) { return req.varName; });
			depList = depList.concat(reqIds);
			argList = argList.concat(reqVars);
		}

		return 'define('
			+ '\'' + module.id + '\', '
			+ (depList.length ? '[' + quoteList(depList) + '], ' : '')
			+ (module.factory ? 'function (' + argList.join(', ') + ') ' : '');
	}

	function writeRequire (req) {
		return req.varName;
	}

	function sortByPos (a, b) { return a.pos == b.pos ? 0 : a.pos < b.pos ? -1 : 1; }

	function quoteList (list) {
		return '\'' + list.join('\', \'') + '\'';
	}

});
