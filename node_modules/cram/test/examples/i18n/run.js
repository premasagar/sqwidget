curl.config({
	packages: {
		curl: { location: '../../../amd_modules/curl/src/curl' },
		app: { location: 'app', config: { moduleLoader: 'curl/loader/cjsm11' } }
	},
	main: 'app/main',
	locale: false
});
