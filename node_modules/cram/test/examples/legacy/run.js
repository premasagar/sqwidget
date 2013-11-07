curl.config({
	packages: {
		curl: { location: 'amd_modules/curl/src/curl' },
		backbone: {
			location: 'amd_modules/backbone',
			main: 'backbone',
			config: {
				loader: 'curl/loader/legacy',
				exports: 'Backbone.noConflict()',
				requires: ['jquery', 'underscore']
			}
		},
		underscore: {
			location: 'amd_modules/underscore',
			main: 'underscore',
			config: {
				loader: 'curl/loader/legacy',
				// can't use noConflict() here since backbone needs a global _
				exports: '_'
			}
		}
	},
	paths: {
		jquery: { location: 'amd_modules/jquery/jquery' }
	}
});

curl(['backbone']).then(function (BB) {
	console.log('global?', window.Backbone);
	console.log('loaded BB.$?', typeof BB.$);
});
