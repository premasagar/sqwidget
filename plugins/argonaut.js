/**
 * Argonaut - A sqwidget plugin
 * Why named this? http://en.wikipedia.org/wiki/Argonauts
 * For JSON transport with optional local storage
 * Can use offline storage with jStorage, if provided,
 * works with it as a cache (ie it should exist in the jQuery provided)
 * @author Graeme Sutherland
 */
 
/*jslint nomen: false*/
/*global Sqwidget,window */    

(function () {

    var 
        /** storage of keys for looking up 'owner' of jsonp results */
        keystore = {},
        /** simple in-memory cache */
        cache = {},
        /** storage service */
        storeService = null;
        
    //expose in Sqwidget namespace for debugging
    Sqwidget.keystore = keystore;

    Sqwidget.plugin('argonaut', function (sqwidget, widget, jQuery, newConfig) {
        var 
            self = {},
            _ = sqwidget._,
            endpointName = 'jsonp',
            config = {
                cacheOptions: {cache: true, store: true, expiry: 30 * 60 }
            };
        
        
        /* init config from supplied*/
        jQuery.extend(true, config, newConfig);

        /**
         * Set up jsonp endpoint -- globally for Sqwidget, to redirect to appropriate argonaut instance
         * and widget based on the static jsonp
         */
    
        if (!Sqwidget[endpointName]) {
            Sqwidget[endpointName] = function (jsonpValue) {
                var 
                    templateName = jsonpValue.type,
                    fullKey = templateName + '-' + jsonpValue.key,
                    arr = null;
                _('got data for ' + templateName + ' full key ' + fullKey);
                // call callbacks and remove when called
                if (keystore[fullKey]) {
                    while (keystore[fullKey].length > 0) {
                        // pull out key and remove it
                        arr = keystore[fullKey].shift();
                        arr[0].jsonpHandler(arr[1], jsonpValue, fullKey, arr[2]);
                    }
                }
            };
        }
            
        /**
         * Get JSON from remote url and call callback with decoded object
         * @param {String} url URL to load. Note, you'll end up with nothing for a cross-site request
         * @param {object} data to include with request
         * @param {Function} callback Callback function on success (or any condition, so it seems)
         * @param {object} options map of options, currently not used
         * TODO:  or provide a global function object that will receive the call and get it into here ?? plan for this?
         * TODO: timeout error handling?
         */
        self.getJSON = function (url, data, callback, options) {

            _('argonaut: get request: ' + url);
            jQuery.get(url, data, function (d, textStatus) {
                //TODO improve error handling here, trap exception and use a widget error handler
                var dj = jQuery.parseJSON(d);
                callback(dj, textStatus);
            });
        };
    
        /**
         * Request static JSONP by script tag.  For this, the host
         *
         */
        self.getStaticJSONP = function (url, key, callback, options) {
            _('argonaut static json request for ' + url + ' with key ' + key);
            // keep the key
            var 
                opts = {},
                fullKey = widget.getConfig('name', 'sqwidgetwidget') + '-' + key,
                cacheEntry;

            jQuery.extend(opts, config.cacheOptions, options);

            // check for cache entry
            cacheEntry = self.getCacheEntry(fullKey, opts);
            if (cacheEntry) {
                // short circuit result 
                _('argonaut: returning cached entry for ' + fullKey);
                callback(cacheEntry.data);
            }
            else {            
                _('argonaut: no cached entry for ' + fullKey);
                // register callback
                if (fullKey in keystore) {
                    keystore[fullKey].push([self, callback, options]);
                }
                else {
                    keystore[fullKey] = [[self, callback, options]];
                }
                jQuery.getScript(url);
            }
        };

        /**
         * Handle a response by script element
         */
        self.jsonpHandler = function (callback, jsonpValue, fullKey, options) {
            if (options && (options.cache || options.store)) {
                _('argonaut: caching ' + fullKey);
                jsonpValue.storeTime = (new Date()).getTime();
                if (options.store && storeService) {
                    storeService.set(fullKey, jsonpValue);
                }
                else {
                    cache[fullKey] = jsonpValue;
                }
            }
            callback(jsonpValue.data);
        };

        /**
         * Set the persistant storage service
         * .. which has set and get operations
         */
        self.setStoreService = function (ss) {
            storeService = ss;
        };
    
        self.getCacheEntry = function (key, options) {
            var
                cacheItem,
                now = (new Date()).getTime();
            if (!options.cache) {
                return null;
            }
            if (options.store && storeService) {
                cacheItem = storeService.get(key);                
            }  
            else if (options.cache) {
                cacheItem = cache[key];
            }
            if (cacheItem && (now - cacheItem.storeTime) < (options.expiry * 1000)) {
                return cacheItem;
            }
            else {
                return null;
            }
        };


        /**
         * Empty one cache entry
         * @param {String} url if a cache url, removes any cache entry for that url
         */
        self.emptyCache = function (url) {
        
        };

        /**
         * Empty entire cache
         * @param {String} url if a cache url, removes any cache entry for that url, if missing, 
         * then re
         */
        self.emptyAllCache = function () {
        
        };


        return self;
    
    }, '0.1.0', ['jquery', 'jstorage']);

}());
