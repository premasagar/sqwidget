curl.config({
	packages: {
		curl: { location: '../../../amd_modules/curl/src/curl' },
		underscore: { location: 'amd_modules/lodash/dist', main: 'lodash.compat.min' }
	}
});

curl(['underscore']).then(function (_) { console.log('loaded', _.all); });
