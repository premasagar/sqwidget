/**
 * Argonaut - A sqwidget plugin
 * Why named this? http://en.wikipedia.org/wiki/Argonauts
 * For JSON transport witho optional local storage
 * Can use offline storage with jStorage (but that is loaded otherwise), if provided,
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
        cache = {};
        
    //expose in Sqwidget namespace for debugging
    Sqwidget.keystore = keystore;

    Sqwidget.plugin('argonaut', function (sqwidget, widget, jQuery, newConfig) {
        var 
            self = {},
            //TODO   _ = sqwidget._ || (window._ && window._.console || function () {};
            _ = sqwidget._ || window._ || function () {},
            endpointName = 'jsonp',
            config = {
                cache: {
                    /** valid settings are 'memory', 'offline_store', 'none' */
                    mode : 'none',
                    /** default cache time in seconds. 0=don't cache */
                    defaultTime : 0,
                    /** limit of number of items in memory cache (otherwise bump oldest?) */
                    memoryCacheItemLimit : 100
                }
            };
        
        
        /* init config from supplied*/
        jQuery.extend(true,config,newConfig);

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
                        arr[0].jsonpHandler(arr[1], jsonpValue);
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
    
    
        self.getStaticJSONP = function (url, key, callback) {
            _('argonaut static json request for ' + url + ' with key ' + key);
            // keep the key
            var fullKey = widget.getConfig('name', 'sqwidgetwidget') + '-' + key;
            // register callback
            if (fullKey in keystore) {
                keystore[fullKey].push([self, callback]);
            }
            else {
                keystore[fullKey] = [[self, callback]];
            }
            jQuery.getScript(url);
        };

        /**
         * Handle a response by script element
         */
        self.jsonpHandler = function (callback, jsonpValue) {
            callback(jsonpValue.data);
        };


        /**
         * Returns TRUE the given object (by url) in in the cache
         * @param url  Lookup key for the cache
         * @return {Boolean} true if in cache
         */
        self.inCache = function (url) {
            // TODO fill in here
            return false;
        };
    
        self.getFromCache = function (url) {
            // TODO fill in here
            return null;
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