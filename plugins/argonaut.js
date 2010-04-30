/**
 * Argonaut - A sqwidget plugin
 * For JSON transport and local storage
 * Can use offline storage with jStorage (but that is loaded otherwise), if provided,
 * works with it as a cache (ie it should exist in the jQuery provided)
 * @author Graeme Sutherland
 */
 
/*jsLint */
/*global Sqwidget */    
 
Sqwidget.plugin('argonaut', function (sqwidget, widget, jQuery) {
    var self = {};


    /**
    * Listen for a message
    * @param {String} topic. The topic name for this message
    */

    /**
     * options -- native jasonp (ie use jQuery pattern &callback=?)
     * or provide a global function object that will receive the call and get it into here ?? plan for this?
     * requestless jsonp.
     * timeout error handling?
     * provide a callback function in the global namespace to retrieve results
     * load a JSON object by url, call callback with it when we know what has happened.  Success or failure
     */
    self.getObject = function (url, callback, options) {
        //TODO
    };


    self.emptyCache = function () {
        
    };

    return self;
    
}, '0.1.0', ['jquery', 'jstorage']);
