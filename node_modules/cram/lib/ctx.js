/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */

define(['curl/_privileged'], function (priv) {

	var core = priv.core;

	/**
	 * Returns the contextual functions for a given module: require,
	 * toAbsId, toUrl, etc.
	 * @param absId {String}
	 * @param callback {Function}
	 * @param errback {Function}
	 */
	return function (absId, parentCfg) {
		var pathInfo, ctx, config;
		// look up path info from parent module
		pathInfo = core.resolvePathInfo(absId, parentCfg);
		config = pathInfo.config;
		// create a new module context
		ctx = core.createContext(config, absId);
		return {
			absId: absId,
			url: function () { return withExt(ctx.require.toUrl(absId)); },
			require: ctx.require,
			toAbsId: ctx.toAbsId,
			toUrl: ctx.require.toUrl,
			withExt: withExt,
			config: config
		};

		function withExt (url) {
			return core.checkToAddJsExt(url, config);
		}
	};

});
