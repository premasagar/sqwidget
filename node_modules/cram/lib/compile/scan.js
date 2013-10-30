/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

define([], function () {

	/*
	 * This function should work for most AMD and UMD formats.
	 * things we need to know about the module:
	 *		- where to insert (or replace) module id
	 *		- what are the dependencies
	 *			- r-value requires should be moved to dep list and
	 *			  variable name assigned. then, substitute require('...') with variable
	 */

	var findDefinesRx, removeCommentsRx, cleanDepsRx, splitArgsRx;

	// find all of these signatures (plus some more variants):
	// define("id", ["dep1", "dep2"], function (dep1, dep2) {...
	// define("id", function (require) {...
	// define("id", function factoryName (require) {...
	// define("id", 5...
	// define("id", {...
	// define("id", "foo"...
	// define("id", new Date()...
	// define("id", factoryName...
	// define(["dep1", "dep2"], function (dep1, dep2) {...
	// define(function (require) {...
	// define(function factoryName (require) {...
	// define(5...
	// define({...
	// define("foo"...
	// define(new Date()...
	// define(factoryName...

	// also, this special wire-specific pattern:
	// define(['a', 'b'], { /* require() in object literal */ });

	// TODO: capture entire AMD define text instead of .count so it can be recreated better

	findDefinesRx = new RegExp(
		// filter out some false positives that we can't eliminate in the
		// rest of the regexps since we may grab too many chars if we do.
		// these are not captured.
		'[.$_]require\\s*\\(|[.$_]define\\s*\\('
		// also find "require('id')" (r-val)
		+ '|\\brequire\\s*\\(\\s*["\']([^"\']+)["\']\\s*\\)'
		// find "define ( 'id'? , [deps]? ," capturing id and deps
		+ '|(\\bdefine)\\s*\\(' // define call
		+ '|\'([^\']*)\'\\s*,|["]([^"]*)["]\\s*,' // id (with comma)
		+ '|(?:\\[([^\\]]*?)\\]\\s*,)' // deps array (with comma)
		// find "function name? (args?) {" OR "{"
		// args doesn't match on quotes ([^)\'"]*) to prevent this snippet from
		// lodash from capturing an extra quote: `'function(' + x + ') {\n'`
		+ '|(?:(function)\\s*[0-9a-zA-Z_$]*\\s*\\(([^)\'"]*)\\))?\\s*({)'
		// block comments
		+ '|(\\/\\*)|(\\*\\/)'
		// line comments
		+ '|(\\/{2})|(\\n|\\r|$)'
		// regexp literals. to disambiguate division sign, check for leading
		// operators. Note: this will falsely identify a division sign
		// at the start of a line as a regexp when there is a second division
		// sign on the same line.  Seriously edgy case, imho.
		+ '|[+\\-*\/=\\,%&|^!(;\\{\\[<>]\\s*(\\/)[^\\/\\n]+\\/' // TODO: escaped slashes
		// quotes and double-quotes
		// escaped quotes are captured, too, but double escapes are ignored
		+ '|(?:\\\\\\\\)|(\\\\["\'])|(["\'])'
		// parens (we need to count them to find the end of the "define(")
		+ '|(\\()|(\\))',
		'g'
	);
	removeCommentsRx = /\/\*[\s\S]*?\*\/|\/\/.*?[\n\r]/g;
	cleanDepsRx = /\s*["']\s*/g;
	splitArgsRx = /\s*,\s*/;

	function scan (source) {
		var modules, module, pCount;

		// states:
		var inComment, inString, inDefine, inFactory;

		// transitions:
		// TODO: hoist amdParser so it can be tested
		// starting state:                trigger:                   ending state:
		// -----------------------------------------------------------------------------------
		// <default state>              --[find "define("]-->        inDefine
		// <default state>              --[find "require(id)"]-->    <throw / exit>
		// inDefine                     --[find module id]-->        inDefine
		// inDefine                     --[find dep array]-->        inDefine
		// inDefine                     --[find end of factory]-->   inFactory
		// inDefine                     --[pCount reaches 0]-->      <default state> (we may have not found a factory)
		// inDefine                     --[find start of comment]--> inComment + inDefine
		// inDefine                     --[find start of string]-->  inString + inDefine
		// inDefine                     --[find "define("]-->        <throw / exit>
		// inFactory                    --[pCount reaches 0]-->      <default state>
		// inFactory                    --[find start of comment]--> inComment + inFactory
		// inFactory                    --[find start of string]-->  inString + inFactory
		// inFactory                    --[find "require(id)"]-->    inFactory
		// inFactory                    --[find "define("]-->        <throw / exit>
		// inComment + <previous state> --[end of comment]-->        <previous state>
		// inString + <previous state>  --[end of string]-->         <previous state>

		modules = [];
		pCount = 0;

		// use .replace() as a fast parsing mechanism, feeding our state machine:
		source.replace(findDefinesRx, amdParser);

		return modules;

		function amdParser (m, rval, def, id1, id2, deps, factory, args, fStart, bcStart, bcEnd, lcStart, lcEnd, rx, escQ, q, pStart, pEnd, matchPos, source) {
			var id = id1 || id2;

			// optimization: just ignore escaped quotes and regexps
			if (escQ || rx) return '';

			// optimization: fStart matches "{" (a lot!), so fail early when not inDefine
			if (!inDefine && fStart) return '';

			// fix false detection of require(), such as `goog.require()` or
			// `$require()`. we can't detect this in the regexp since it
			// will then grab too many characters.
//			if (rval && source[matchPos - 1]) {
//				rval = null;
//			}

			// optimization: inComment and inString are treated as a separate set of
			// states from the primary states (inDefine, inFactory).
			// if either of these is true, don't replace (or push) the previous state.
			// just "carry" it along until we leave inComment or inString.
			// this is simpler and faster than pushing/popping the previous state.
			if (inComment) {
				// check if we're leaving a comment
				if ((inComment == '/*' && bcEnd != null) || (inComment == '//' && lcEnd != null)) inComment = '';
			}

			else if (inString) {
				// check if we're leaving the string
				if (inString == q) inString = '';
			}

			else if (inFactory) {

				if (def) throw new Error('embedded define() or parsing error.');

				if (rval) {

					if (!module.requires) module.requires = [];

					module.requires.push({
						id: rval,
						pos: matchPos,
						count: m.length
					});
				}

				else {
					countParens(pStart, pEnd);
					checkCommentsAndStrings(bcStart || lcStart, q);
				}
			}

			else if (inDefine) {

				if (def) throw new Error('embedded define() or parsing error.');

				if (id) {
					module.id = id;
				}

				else if (deps) {
					captureDeps(deps);
					captureSignatureCount(matchPos, m.length);
				}

				else if (fStart) {
					if (factory) module.factory = !!factory;
					if (args) captureArgs(args);
					// the -1 is here to remove final "{" which is not inserted
					// by the normalize step. this will get fixed when we start
					// capturing the entire define() text. See TODO above.
					captureSignatureCount(matchPos, m.length - 1);
					toFactory();
				}

				else {
					countParens(pStart, pEnd);
					checkCommentsAndStrings(bcStart || lcStart, q);
				}
			}

			else /* outside of a define, factory, comment, or string */ {

				if (rval) {
					if (!modules.warnings) modules.warnings = [];
					modules.warnings.push('sync require() found in the global scope or in an external factory.');
				}

				if (def) {
					toDefine();
					captureSignatureCount(matchPos, m.length);
				}
				else {
					countParens(pStart, pEnd);
					checkCommentsAndStrings(bcStart || lcStart, q);
				}
			}

			return '';

			function toGlobal () {
				inFactory = inDefine = false;
			}

			function toDefine () {
				module = {};
				modules.push(module);
				inFactory = false;
				inDefine = true;
				pCount = 1;
			}

			function toFactory () {
				inFactory = true;
				inDefine = false;
			}

			function captureSignatureCount (pos, length) {
				// this will get recomputed multiple times if there are deps or a factory
				// if this is the first time, record start of "define("
				if (module.pos == null) module.pos = pos;
				// the first time here, this just captures length
				module.count = pos - module.pos + length;
			}

			function captureArgs (args) {
				module.argList = args.replace(removeCommentsRx, '').split(splitArgsRx);
			}

			function captureDeps (deps) {
				module.depList = deps.replace(removeCommentsRx, '')
					.replace(cleanDepsRx, '')
					.split(splitArgsRx);
			}

			function countParens (enter, exit) {
				if (enter) {
					pCount++;
				}
				else if (exit) {
					pCount--;
					if (pCount === 0) {
						// we hit the end of the "define("
						toGlobal();
					}
				}
			}

			function checkCommentsAndStrings (commentType, stringType) {
				if (commentType) inComment = commentType;
				if (stringType) inString = stringType;
			}

		}

	}

	return scan;

});
