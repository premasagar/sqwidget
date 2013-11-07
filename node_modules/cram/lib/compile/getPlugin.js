/** MIT License (c) copyright 2010-2013 B Cavalier & J Hann */
(function (define) {
define(function (require) {

	var when = require('when');

	function getPlugin (parentCtx, fileCtx, getCtx) {
		var parts, dfd;

		dfd = when.defer();
		parts = pluginParts(parentCtx.toAbsId(fileCtx.absId));

		if (!parts.pluginId) {
			// check for module loader
			if (fileCtx.config.moduleLoader || fileCtx.config.loader) {
				parts = {
					pluginId: fileCtx.config.moduleLoader || fileCtx.config.loader,
					loader: true,
					resourceId: fileCtx.absId
				};
			}
		}

		if (parts.pluginId) {
			// plugin-based resources get normalized via plugin
			getModule(parts.pluginId, parentCtx).then(function (plugin) {
				var pluginCtx;
				if (plugin.cramPlugin) {
					pluginCtx = getCtx(parts.pluginId, parentCtx.config);
					return getModule(plugin.cramPlugin, pluginCtx);
				}
				else {
					return plugin;
				}
			})
			.then(function (plugin) {
				fileCtx.pluginId = parts.pluginId;
				fileCtx.resourceId = parts.resourceId;
				fileCtx.loader = parts.loader;
				if (plugin.normalize) {
					parts.resourceId = plugin.normalize(parts.resourceId, parentCtx.toAbsId, parentCtx.config);
				}
				else {
					parts.resourceId = parentCtx.toAbsId(parts.resourceId);
				}
				if (parts.loader) {
					// If this plugin is actually a module loader then don't prepend pluginId
					fileCtx.absId = parts.resourceId;
				}
				else {
					fileCtx.absId = parts.pluginId + '!' + parts.resourceId;
				}
				fileCtx.resourceId = parts.resourceId;
				// HACK: we're using a function so the plugin property
				// won't get JSON.stringify()ed
				fileCtx.plugin = function () { return plugin; };
				return fileCtx;
			})
			.then(dfd.resolve, dfd.reject);
		}
		else {
			dfd.resolve(fileCtx);
		}

		return dfd.promise;
	}

	return getPlugin;

	function getModule (id, parentCtx) {
		var dfd = when.defer();
		parentCtx.require([id], dfd.resolve, dfd.reject);
		return dfd.promise;
	}

	function pluginParts (id) {
		var delPos = id.indexOf('!');
		return {
			resourceId: id.substr(delPos + 1),
			// resourceId can be zero length
			pluginId: delPos >= 0 && id.substr(0, delPos)
		};
	}

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));
