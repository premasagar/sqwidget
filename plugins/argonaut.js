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
        storeService = null,
        /** getJSONService */
        transportService = {};
        
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
        
         
        /* init config from supplied */
        jQuery.extend(true, config, newConfig);

        /* init transport services */
        transportService = {
            getJSON: jQuery.getJSON,
            getScript: Sqwidget.getScript
        };            

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
        
        self.addCacheEntry = function (key, data, opts) {
            _('argonaut: adding to cache ' + key);
            data.storeTime = (new Date()).getTime();
            if (opts.store && storeService) {
                storeService.set(key, data);
            }
            else {
                cache[key] = data;
            }
        };
            
            
        /**
         * Get JSON from remote url and call callback with decoded object
         * @param {String} url URL to load. Note, you'll end up with nothing for a cross-site request
         * @param {object} data to include with request
         * @param {Function} callback Callback function on success (or any condition, so it seems)
         * @param {object} options map of options, currently not used
         * TODO:  or provide a global function object that will receive the call and get it into here ?? plan for this?
         * TODO: refit with cache model as well
         */
        self.getJSON = function (url, data, callback, options) {
            var 
                opts = {},
                fullKey = widget.getConfig('name', 'sqwidgetwidget') + '-' + url,
                cacheEntry;

            _('argonaut: get JSON request: ' + url);
            _('argonaut: full key is: ' + fullKey);
            
            jQuery.extend(opts, config.cacheOptions, options);
            // check if already cached
            cacheEntry = self.getCacheEntry(fullKey, opts);
            if (cacheEntry) {
                _('argonaut: returning cached entry for ' + fullKey);
                callback(cacheEntry.data);
            }
            else {    
                // TODO abstract this call   
                transportService.getJSON(url, function (rawData, textStatus) {
                    var 
                        data = {data: rawData};
                        
                    if (opts && (opts.cache || opts.store)) {
                        self.addCacheEntry(fullKey, data, opts);
                    }
                    callback(data.data, textStatus);
                });
            }
            
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
                transportService.getScript(url);
            }
        };

        /**
         * Handle a response by script element
         */
        self.jsonpHandler = function (callback, jsonpValue, fullKey, options) {
            if (options && (options.cache || options.store)) {
                self.addCacheEntry(fullKey, jsonpValue, options);
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
        
        /**
         * Set transport services as needed
         * @param object An object providing methods for transports
         */
        self.setTransportService = function (newTransportService) {
            jQuery.extend(true, transportService, newTransportService);
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
