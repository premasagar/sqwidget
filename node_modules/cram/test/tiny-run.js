define(function () {

	var config = {
		baseUrl: '',
		paths: {
			curl: './support/curl/src/curl',
			"test-js": 'test'
		},
		pluginPath: 'curl/plugin'
	};

	curl(config, ['test-js/tiny', 'test-js/external-factory']).then(
		function () {
			setPageState('loaded');
			// this should never get called by cram:
			curl(['some/other/module']);
		},
		function () {
			setPageState('failed');
		}
	);


	// do something DOM-ish (this code should never execute during build!)
	function setPageState (stateClass) {
		var root = document.documentElement;
		root.className = root.className.replace(/loading/, '')
			+ ' ' + stateClass;
	}

});
