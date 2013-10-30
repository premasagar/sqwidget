(function () {
	define(['test-js/moduleWithPluginDeps', 'test-js/depA'], fact);

	function fact (m, a) {
		console.log('tiny is loaded');
	}
}());
