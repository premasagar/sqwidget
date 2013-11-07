(function () {

	var config = {
		baseUrl: '',
		paths: {
			curl: 'support/curl/src/curl',
			"test-js": 'test/data',
			"sizzle": "../sizzle/sizzle"
		},
		packages: [
			// note: i realize this only works if wire repo is a peer to cram.
			{ name: 'wire', location: '../wire', main: './wire' },
			{ name: 'meld', location: '../meld', main: './meld' },
			{ name: 'poly', location: '../poly', main: './poly' }
		],
		pluginPath: 'curl/plugin',
		preloads: ['poly/all'],
		main: 'wire!test-js/spec'
	};

	curl(config);

}());
