"use strict";

/**
 * Offline store - wrapper for offline storage.  Basically a wrapper
 * around jStorage including generating nice ids to store stuff, but 
 * later to handle full offline widets.  Later.
 * @author Graeme Sutherland
 */
 
/*jslint nomen: false ,white: false*/
/*global Sqwidget,window,document */    

(function () {
    /*
     * jQuery JSON Plugin
     * version: 2.1 (2009-08-14)
     *
     * This document is licensed as free software under the terms of the
     * MIT License: http://www.opensource.org/licenses/mit-license.php
     *
     * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
     * website's http://www.json.org/json2.js, which proclaims:
     * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
     * I uphold.
     *
     * It is also influenced heavily by MochiKit's serializeJSON, which is 
     * copyrighted 2005 by Bob Ippolito.
     */

    (function($) {
        var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
            _meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };    
    
        /** jQuery.toJSON( json-serializble )
            Converts the given argument into a JSON respresentation.

            If an object has a "toJSON" function, that will be used to get the representation.
            Non-integer/string keys are skipped in the object, as are keys that point to a function.

            json-serializble:
                The *thing* to be converted.
         **/
        $.toJSON = function(o)
        {
            var type;
        
            if (typeof(JSON) === 'object' && JSON.stringify){
                return JSON.stringify(o);
            }

            type = typeof(o);

            if (o === null){
                return "null";
            }

            if (type === "undefined"){
                return undefined;
            }

            if (type === "number" || type === "boolean"){
                return o + "";
            }

            if (type === "string"){
                return $.quoteString(o);
            }

            if (type === 'object')
            {
                if (typeof o.toJSON === "function"){
                    return $.toJSON( o.toJSON() );
                }

                if (o.constructor === Date)
                {
                    var month = o.getUTCMonth() + 1;
                    if (month < 10){
                        month = '0' + month;
                    }

                    var day = o.getUTCDate();
                    if (day < 10){
                        day = '0' + day;
                    }

                    var year = o.getUTCFullYear();

                    var hours = o.getUTCHours();
                    if (hours < 10){
                        hours = '0' + hours;
                    }

                    var minutes = o.getUTCMinutes();
                    if (minutes < 10){
                        minutes = '0' + minutes;
                    }

                    var seconds = o.getUTCSeconds();
                    if (seconds < 10){
                        seconds = '0' + seconds;
                    }

                    var milli = o.getUTCMilliseconds();
                    if (milli < 100){
                        milli = '0' + milli;
                    }
                    if (milli < 10){
                        milli = '0' + milli;
                    }

                    return '"' + year + '-' + month + '-' + day + 'T' +
                                 hours + ':' + minutes + ':' + seconds + 
                                 '.' + milli + 'Z"'; 
                }

                if (o.constructor === Array) 
                {
                    var ret = [],
                        len = o.length,
                        i;
                    for (i = 0; i < len; i++){
                        ret.push( $.toJSON(o[i]) || "null" );
                    }

                    return "[" + ret.join(",") + "]";
                }

                var pairs = [];
                for (var k in o) {
                    if (o.hasOwnProperty(k)){
                        var name;
                        type = typeof k;

                        if (type === "number"){
                            name = '"' + k + '"';
                        }
                        else if (type === "string"){
                            name = $.quoteString(k);
                        }
                        else {
                            continue;  //skip non-string or number keys
                        }

                        if (typeof o[k] === "function"){
                            continue;  //skip pairs where the value is a function.
                        }

                        var val = $.toJSON(o[k]);

                        pairs.push(name + ":" + val);
                   }
                }

                return "{" + pairs.join(", ") + "}";
            }
        };

        /** jQuery.evalJSON(src)
            Evaluates a given piece of json source.
         **/
        $.evalJSON = function(src)
        {
            if (typeof(JSON) === 'object' && JSON.parse){
                return JSON.parse(src);
            }
            return eval("(" + src + ")");
        };

        /** jQuery.secureEvalJSON(src)
            Evals JSON in a way that is *more* secure.
        **/
        $.secureEvalJSON = function(src)
        {
            if (typeof(JSON) === 'object' && JSON.parse){
                return JSON.parse(src);
            }

            var filtered = src;
            filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
            filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
            filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

            if (/^[\],:{}\s]*$/.test(filtered)){
                return eval("(" + src + ")");
            }
            else {
                throw new SyntaxError("Error parsing JSON, source is not valid.");
            }
        };

        /** jQuery.quoteString(string)
            Returns a string-repr of a string, escaping quotes intelligently.  
            Mostly a support function for toJSON.

            Examples:
                >>> jQuery.quoteString("apple")
                "apple"

                >>> jQuery.quoteString('"Where are we going?", she asked.')
                "\"Where are we going?\", she asked."
         **/
        $.quoteString = function(string)
        {
            if (string.match(_escapeable))
            {
                return '"' + string.replace(_escapeable, function (a) 
                {
                    var c = _meta[a];
                    if (typeof c === 'string'){
                        return c;
                    }
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                }) + '"';
            }
            return '"' + string + '"';
        };
    }(jQuery));


    // locally load jStorage into jQuery if not already there

    /**
     * ----------------------------- JSTORAGE -------------------------------------
     * Simple local storage wrapper to save data on the browser side, supporting
     * all major browsers - IE6+, Firefox2+, Safari4+, Chrome4+ and Opera 10.5+
     *
     * Copyright (c) 2010 Andris Reinman, andris.reinman@gmail.com
     * Project homepage: www.jstorage.info
     *
     * Licensed under MIT-style license:
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */

    /**
     * USAGE:
     *
     * jStorage requires Prototype, MooTools or jQuery! If jQuery is used, then
     * jQuery-JSON (http://code.google.com/p/jquery-json/) is also needed.
     * (jQuery-JSON needs to be loaded BEFORE jStorage!)
     *
     * Methods:
     *
     * -set(key, value)
     * $.jStorage.set(key, value) -> saves a value
     *
     * -get(key[, default])
     * value = $.jStorage.get(key [, default]) ->
     *    retrieves value if key exists, or default if it doesn't
     *
     * -deleteKey(key)
     * $.jStorage.deleteKey(key) -> removes a key from the storage
     *
     * -flush()
     * $.jStorage.flush() -> clears the cache
     * 
     * -storageObj()
     * $.jStorage.storageObj() -> returns a read-ony copy of the actual storage
     * 
     * -storageSize()
     * $.jStorage.storageSize() -> returns the size of the storage in bytes
     *
     * -index()
     * $.jStorage.index() -> returns the used keys as an array
     * 
     * <value> can be any JSON-able value, including objects and arrays.
     *
     */

    var jStorageService = function($, store_key){
        if(!$ || !($.toJSON || Object.toJSON || window.JSON)){
            throw new Error("jQuery, MooTools or Prototype needs to be loaded before jStorage!");
        }

        var
            jStorage,
            
            _storage_type = '',
            
            /* This is the object, that holds the cached values */ 
            _storage = {},
            
            /* Key that values are stored under */
            _store_key = store_key,

            /* Actual browser storage (localStorage or globalStorage['domain']) */
            _storage_service = {},

            /* DOM element for older IE versions, holds userData behavior */
            _storage_elm = null,

            /* How much space does the storage take */
            _storage_size = 0,

            /* function to encode objects to JSON strings */
            json_encode = $.toJSON || Object.toJSON || (window.JSON && (JSON.encode || JSON.stringify)),

            /* function to decode objects from JSON strings */
            json_decode = $.evalJSON || (window.JSON && (JSON.decode || JSON.parse)) || function(str){
                return String(str).secureEvalJSON();
            },

            /**
             * XML encoding and decoding as XML nodes can't be JSON'ized
             * XML nodes are encoded and decoded if the node is the value to be saved
             * but not if it's as a property of another object
             * Eg. -
             *   $.jStorage.set("key", xmlNode);        // IS OK
             *   $.jStorage.set("key", {xml: xmlNode}); // NOT OK
             */
            _XMLService = {

                /**
                 * Validates a XML node to be XML
                 * based on jQuery.isXML function
                 */
                isXML: function(elm){
                    var documentElement = (elm ? elm.ownerDocument || elm : 0).documentElement;
                    return documentElement ? documentElement.nodeName !== "HTML" : false;
                },

                /**
                 * Encodes a XML node to string
                 * based on http://www.mercurytide.co.uk/news/article/issues-when-working-ajax/
                 */
                encode: function(xmlNode) {
                    if(!this.isXML(xmlNode)){
                        return false;
                    }
                    try{ // Mozilla, Webkit, Opera
                        return new XMLSerializer().serializeToString(xmlNode);
                    }catch(E1) {
                        try {  // IE
                            return xmlNode.xml;
                        }catch(E2){}
                    }
                    return false;
                },

                /**
                 * Decodes a XML node from string
                 * loosely based on http://outwestmedia.com/jquery-plugins/xmldom/
                 */
                decode: function(xmlString){
                    var dom_parser = ("DOMParser" in window && (new DOMParser()).parseFromString) ||
                            (window.ActiveXObject && function(_xmlString) {
                        var xml_doc = new ActiveXObject('Microsoft.XMLDOM');
                        xml_doc.async = 'false';
                        xml_doc.loadXML(_xmlString);
                        return xml_doc;
                    }),
                    resultXML;
                    if(!dom_parser){
                        return false;
                    }
                    resultXML = dom_parser.call("DOMParser" in window && (new DOMParser()) || window, xmlString, 'text/xml');
                    return this.isXML(resultXML)?resultXML:false;
                }
            };

        ////////////////////////// PRIVATE METHODS ////////////////////////

        /**
         * Initialization function. Detects if the browser supports DOM Storage
         * or userData behavior and behaves accordingly.
         * @returns undefined
         */
        function _init(){
            
            _storage_service[_store_key] = "{}";
            /* Check if browser supports localStorage */
            if("localStorage" in window){
                try {
                    _storage_service = window.localStorage;
                    _storage_type = 'localstorage';
                } catch(E3) {/* Firefox fails when touching localStorage and cookies are disabled */}
            }
            /* Check if browser supports globalStorage */
            else if("globalStorage" in window){
                try {
                    _storage_service = window.globalStorage[window.location.hostname];
                    _storage_type = 'globalstorage';
                } catch(E4) {/* Firefox fails when touching localStorage and cookies are disabled */}
            }
            /* Check if browser supports userData behavior */
            else {
                _storage_elm = document.createElement('link');
                if(_storage_elm.addBehavior){

                    /* Use a DOM element to act as userData storage */
                    _storage_elm.style.behavior = 'url(#default#userData)';

                    /* userData element needs to be inserted into the DOM! */
                    document.getElementsByTagName('head')[0].appendChild(_storage_elm);

                    _storage_elm.load(_store_key);
                    var data = "{}";
                    try{
                        data = _storage_elm.getAttribute(_store_key);
                    }catch(E5){}
                    _storage_service[store_key] = data;
                    _storage_type = 'userdata';
                }else{
                    _storage_elm = null;
                    return;
                }
            }

            /* if jStorage string is retrieved, then decode it */
            if(_storage_service[_store_key]){
                try{
                    _storage = json_decode(String(_storage_service[_store_key]));
                }catch(E6){_storage_service[_store_key] = "{}";}
            }else{
                _storage_service[_store_key] = "{}";
            }
            _storage_size = _storage_service[_store_key]?String(_storage_service[_store_key]).length:0;
        }

        /**
         * This functions provides the "save" mechanism to store the jStorage object
         * @returns undefined
         */
        function _save(){
            try{
                _storage_service[_store_key] = json_encode(_storage);
                // If userData is used as the storage engine, additional
                if(_storage_elm) {
                    _storage_elm.setAttribute(_store_key,_storage_service[_store_key]);
                    _storage_elm.save(_store_key);
                }
                _storage_size = _storage_service[_store_key]?String(_storage_service[_store_key]).length:0;
            }catch(E7){/* probably cache is full, nothing is saved this way*/
                return false;
            }
            return true;
        }

        /**
         * Function checks if a key is set and is string or numberic
         */
        function _checkKey(key){
            if((!key && key!==0) || (typeof key !== "string" && typeof key !== "number")){
                throw new TypeError('Key name must be string or numeric');
            }
            return true;
        }

        ////////////////////////// PUBLIC INTERFACE /////////////////////////

        jStorage = {
            /* Version number */
            version: "0.1.4.1",

            /**
             * Sets a key's value.
             * 
             * @param {String} key - Key to set. If this value is not set or not
             *                a string an exception is raised.
             * @param value - Value to set. This can be any value that is JSON
             *                compatible (Numbers, Strings, Objects etc.).
             * @returns the used value
             */
            set: function(key, value){
                _checkKey(key);
                if(_XMLService.isXML(value)){
                    value = {_is_xml:true,xml:_XMLService.encode(value)};
                }
                _storage[key] = value;
                return _save();
            },

            /**
             * Looks up a key in cache
             * 
             * @param {String} key - Key to look up.
             * @param {mixed} def - Default value to return, if key didn't exist.
             * @returns the key value, default value or <null>
             */
            get: function(key, def){
                _checkKey(key);
                if(key in _storage){
                    if(typeof _storage[key] === "object" &&
                            _storage[key]._is_xml &&
                                _storage[key]._is_xml){
                        return _XMLService.decode(_storage[key].xml);
                    }else{
                        return _storage[key];
                    }
                }
                return def;
            },

            /**
             * Deletes a key from cache.
             * 
             * @param {String} key - Key to delete.
             * @returns true if key existed or false if it didn't
             */
            deleteKey: function(key){
                _checkKey(key);
                if(key in _storage){
                    delete _storage[key];
                    return _save();
                }
                return false;
            },

            /**
             * Deletes everything in cache.
             * 
             * @returns true
             */
            flush: function(){
                var ret;
                _storage = {};
                ret = _save();
                /*
                 * Just to be sure - andris9/jStorage#3
                 */
                try{
                    window.localStorage.clear();
                    ret = true;
                }catch(E8){
                    ret = ret || false;
                }
                return ret;
            },

            /**
             * Returns a read-only copy of _storage
             * 
             * @returns Object
            */
            storageObj: function(){
                function F() {}
                F.prototype = _storage;
                return new F();
            },

            /**
             * Returns an index of all used keys as an array
             * ['key1', 'key2',..'keyN']
             * 
             * @returns Array
            */
            index: function(){
                var index = [], i;
                for(i in _storage){
                    if(_storage.hasOwnProperty(i)){
                        index.push(i);
                    }
                }
                return index;
            },

            /**
             * How much space in bytes does the storage take?
             * 
             * @returns Number
             */
            storageSize: function(){
                return _storage_size;
            },

            /**
             * Which DOM storage type is being used?
             * 
             * @returns String
             */
            storageType: function(){
                return _storage_type;
            }
        };

        // Initialize jStorage
        _init();
        return jStorage;
    };
    
    
    //////////////


    Sqwidget.plugin('store', function (sqwidget, widget, jQuery, options) {
        var 
            self = function(key, value, options){
                return typeof value === 'undefined' ?
                     self.get(key) :
                     self.set(key, value, options);
            },
            
            _ = sqwidget._,
            
            defaultOptions = {},
            
        // per-template storage
        store_key = 'sqwidget-' + (widget.getConfig('name') || 'anon'),
        
        // per-template storage object
        jStorage = jStorageService(jQuery, store_key);
        
        // options for configuration            
        options = jQuery.extend(true, defaultOptions, options);

        /**
         * Generate a unique storage key for this give key.  This will be unique 
         * for this widget instance
         */
        self.widgetStoreKey = function(key) {
            // per-widget instance key, inside the per-template overall storage object
            var prefix = widget.getId() || 'anon';
            return prefix + '.' + key;
        };
        
        self.set = function(key, value){
            var wrap = {
                    t: (new Date()) + '', // timestamp
                    v: value // value being stored
                },
                k = self.widgetStoreKey(key),
                storageType = self.type(),
                ret;
            
            if (typeof value === 'undefined'){
                _('store.set: No value passed. Returning.');
                return false;
            }
            
            ret = jStorage.set(k, wrap);
            _('store.set: ' + k, value, storageType);
            return ret;
        };
        
        self.getWrapper = function(key) {
            var k = self.widgetStoreKey(key);
            return jStorage.get(k);
        };
        
        self.get = function(key, defaultValue) {
            var wrap = self.getWrapper(key),
                value = wrap ? wrap.v : defaultValue,
                storageType = self.type();
                
            _('store.get: ' + key, value, storageType);
            return value;
        };
        
        self.del = function(key) {
            return jStorage.deleteKey(self.widgetStoreKey(key));            
        };
        
        // TODO: verify that jStorage's storageSize is accurate for objects and arrays (it should prob use json_encode, rather than String())
        self.size = function(key){
            var value;
            if (key){
                value = self.getWrapper(key);
                return value ? jQuery.toJSON(value).length : 0;
            }
            return jStorage.storageSize();
        };
        
        self.type = function(){
            return jStorage.storageType();
        };
        
        self.module = function(name, methods){
            // methods: get, set, del, flush
        };
        
        // COOKIE: This sets an individual cookie. Objects and Arrays can be stored. In order to keep cookies per domain to a minimum, it is suggested that widgets use only one cookie, and store an object hash of properties, rather than storing each property as its own cookie.
        self.cookie = jQuery.extend(
            function(key, value, expires){
                var ck = self.cookie;
                return typeof value === 'undefined' ?
                     ck.get(key) :
                     ck.set(key, value, expires);
            },
            
            {
                // modified from http://www.quirksmode.org/js/cookies.html
                set: function(key, value, expires){
                    var day = 86400000,
                        expiryTime = '',
                        deleting = (expires === -1),
                        date, ret;
                    
                    if (typeof value === 'undefined' && !deleting){
                        _('store.set.cookie: No value passed. Returning.');
                        return false;
                    }
                
                    key = self.widgetStoreKey(key);
                    value = jQuery.toJSON(value);
                    if (expires){
                        date = new Date();
                        date.setTime(date.getTime() + (expires * day));
                        expiryTime = "; expires=" + date.toGMTString();
                    }
                    document.cookie = key + "=" + value + expiryTime + "; path=/";
                    ret = !!(document.cookie) || deleting;
                    _('store.cookie: setting ' + key + ' to ' + value + '; ' + (ret ? 'success' : 'fail'));
                    return ret;
                },
                
                getWrapper: function(key){
                    key = self.widgetStoreKey(key);
                    
                    var keyEQ = key + "=",
                        cookies = document.cookie.split(';'),
                        value;
                        
                    jQuery.each(cookies, function(i, cookie){
                        cookie = jQuery.trim(cookie);
                        
                        if (cookie.indexOf(keyEQ) === 0) {
                            value = cookie.substring(keyEQ.length, cookie.length);
                            return false; // exit each() loop
                        }
                    });
                    
                    return value;
                },
                
                get: function(key, defaultValue){
                    var json = self.cookie.getWrapper(key);
                    
                    return (typeof json !== 'undefined') ?
                        jQuery.evalJSON(json) :
                        defaultValue;
                },
                
                del: function(key){
                    var undef,
                        cookiesBefore = document.cookie; // used to determine if cookies are present
                                                
                    self.cookie.set(key, undef, -1);                    
                    return !!cookiesBefore;
                },
                
                size: function(key){
                    var json = self.cookie.getWrapper(key);
                    return (typeof json !== 'undefined') ?
                        json.length :
                        0;
                }
            }        
        );

        return self;
    
    }, '0.3.0', ['jquery']);

}());
