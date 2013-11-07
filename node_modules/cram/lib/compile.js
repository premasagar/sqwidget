/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
define(function (require) {

	var when = require('when');
	var sequence = require('when/sequence');
	var getCtx = require('./ctx');
	var scan = require('./compile/scan');
	var getPlugin = require('./compile/getPlugin');
	var locate = require('./compile/locate');
	var amdFromPlugin = require('./transform/amdFromPlugin');

	var pseudoModules;

	pseudoModules = { require: 1, exports: 1, module: 1 };

	function configure (status, readFromSource, readFile, writeToCache, collect) {
		var parse, compileDeps;

		parse = partial(parseModules, status);
		compileDeps = partial(processDeps, compile);

		return compile;

		function compile (parentCtx, ids) {
			var excludes, toAmd, fetch;

			excludes = parentCtx.config.excludes;
			toAmd = amdFromPlugin(readFile, parentCtx);
			fetch = partial(fetchSource, readFromSource, compile, toAmd);

			return when.map(ids, function (id) {
				var ctx, absId;

				// normalize
				absId = parentCtx.toAbsId(id);

				if (id in pseudoModules) return { absId: absId };

				ctx = getCtx(absId, parentCtx.config);

				// check if this module is excluded
				if (excludes && excludes.indexOf(absId) >= 0) {
					ctx.source = '';
					return ctx;
				}

				status.info('Compiling ' + absId);

				return getPlugin(parentCtx, ctx, getCtx)
					.then(locate)
					.then(fetch)
					.then(parse)
					.then(deanonymize)
					.then(compileDeps)
					.then(notify)
					.then(writeToCache)
					.yield(ctx);


			});

		}

		function notify (fileCtx) {
			collect(fileCtx.absId, fileCtx);
			return fileCtx;
		}

	}

	function processDeps (compile, ctx) {
		var deps = collectDeps(ctx);
		if (deps.length) {
			return compile(ctx, deps)
				.then(function (depCtxs) {
					fixDepIds(depCtxs, ctx);
				})
				.yield(ctx);
		}
		else {
			return ctx;
		}
	}

	function fetchSource (readSource, compile, toAmd, ctx) {
		if (ctx.plugin) {
			return toAmd(ctx).then(function (source) {
				if (source) {
					ctx.source = source;
				}
				else {
					// run-time plugin, just include plugin and deps
					ctx.source = '';
					ctx.modules = compile(ctx, [ctx.pluginId]);
				}
				return ctx;
			});
		}
		else {
			return readSource(ctx);
		}
	}

	function deanonymize (fileCtx) {
		// assign id to first anonymous module
		fileCtx.modules.every(function (module) {
			if (!module.id) module.id = fileCtx.absId;
			else return true;
		});
		return fileCtx;
	}

	return configure;

	function parseModules (status, fileCtx) {
		var prettifier, results;
		prettifier = prettifyMessage.bind(null, fileCtx);
		try {
			results = scan(fileCtx.source);
		}
		catch (ex) {
			throw prettifyErrorMessage(fileCtx, ex);
		}
		// scan for AMD meta data
		return when(results, function (modules) {
			//if (modules.errors) modules.errors.forEach(io.error);
			if (modules.warnings) {
				modules.warnings.forEach(chain(prettifier, status.warn));
			}
			if (modules.infos) {
				modules.infos.forEach(chain(prettifier, status.info));
			}
			fileCtx.modules = modules || [];
			return fileCtx;
		});
	}

	function prettifyMessage (moduleCtx, msg) {
		return '[' + moduleCtx.absId + '] ' + msg;
	}

	function prettifyErrorMessage (moduleCtx, ex) {
		ex.message = prettifyMessage(moduleCtx, ex.message);
		return ex;
	}

	function chain (func1, func2) {
		return function () {
			return func2(func1.apply(this, arguments));
		}
	}

	function collectDeps (fileCtx) {
		// iterate through modules found in AMD meta data
		return fileCtx.modules.reduce(function (deps, module) {

			if (module.depList) {
				deps = deps.concat(module.depList);
			}

			if (module.requires) {
				deps = deps.concat(
					module.requires.map(function (req) { return req.id; })
				);
			}

			return deps;
		}, []);

	}

	function fixDepIds (depCtxs, parentModule) {
		// correct the dependency ids since some may have been normalized
		// by plugins.
		var depCount = parentModule.depList ? parentModule.depList.length : 0;
		if (depCount) {
			depCtxs.forEach(function (depCtx, i) {
				if (i < depCount) {
					parentModule.depList[i] = depCtx.absId;
				}
				else {
					parentModule.requires[i - depCount].id = depCtx.absId;
				}
			});
		}
	}

	function partial (func /* ...params */) {
		return Function.prototype.bind.apply(func, arguments);
	}

});
