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
 
Sqwidget.plugin('argonaut', function (sqwidget, widget, jQuery) {
    var 
        self = {},
        //TODO   _ = sqwidget._ || (window._ && window._.console || function () {};
        _ = sqwidget._ || window._ || function () {};

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
        //TODO cache/offline stuff
        //For now, simply get it and return wieh
        _('argonaut: get request: ', url);
        jQuery.get(url, data, function (d, textStatus) {
            //TODO improve error handling here, trap exception and use a widget error handler
            var dj=jQuery.parseJSON(d);
            callback(dj, textStatus);
        });
    };

    //TODO by URL??
    self.emptyCache = function (url) {
        
    };

    return self;
    
}, '0.1.0', ['jquery', 'jstorage']);
