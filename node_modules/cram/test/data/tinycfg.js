(function (define) {
define(function (require) {

	return {
		"baseUrl": "",
		"paths": {
			"test-js": "test"
		},
		"pluginPath": "curl/plugin"
	};

});
}(
	typeof define == 'function' && define.amd
		? define
		: function (factory) { module.exports = factory(require); }
));