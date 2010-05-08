'use strict';

/*!!
* Sqwidget
*   github.com/premasagar/sqwidget
*
*//*
    jQuery widget library

    by Premasagar Rose
        dharmafly.com

    license
        opensource.org/licenses/mit-license.php

    **

    creates global object
        Sqwidget

    **
        
    v0.1
        
*/

/**
* GLOBALS VARS
**/
// TODO: let sqwidget objects be created either with or without 'new' operator

var Sqwidget;
  
 
// ****

/**
* SQWIDGET CORE
**/
(function () {

    // set up debug
    if (this.location && this.location.search.indexOf('sqwidgetDebug') !== -1){
        this.sqwidgetDebug = true;
    }

// **
// NATIVE JAVASCRIPT DEPENDENCIES


/*!
* Ready
*   github.com/premasagar/mishmash/tree/master/ready/
*
*//*
    onDocumentReady abstraction, adapted from jQuery 1.4 by James Padolsey <james.padolsey.com>

    license
        opensource.org/licenses/mit-license.php
        
    v0.1

*/

var ready = (function(){
    var
        window = this,
        doc = window.document,
        docEl = doc.documentElement,
        addEventListener = doc.addEventListener,
        attachEvent = doc.attachEvent,
        readyFns = [],
        ready,
        bound,
        dcl = 'DOMContentLoaded',
        orsc = 'onreadystatechange',
        atTopLevel;
    
    function fireReady() {
        
        if (ready) { return; }
        ready = true;
        
        for (var i = 0, l = readyFns.length; i < l; i++) {
            readyFns[i]();
        }
        
    }
    
    function scrollCheck() {
        
        if (ready) { return; }
        
        try {
            // http://javascript.nwbox.com/IEContentLoaded/
            docEl.doScroll("left");
        } catch(e) {
            setTimeout(scrollCheck, 1);
            return;
        }
        
        // DOM ready
        fireReady();
        
    }
    
    function DOMContentLoaded() {
        
        if ( addEventListener ) {
            doc.removeEventListener(dcl, DOMContentLoaded, false);
            fireReady();
        } else {
            if ( attachEvent && doc.readyState === 'complete' ) {
                doc.detachEvent(orsc, DOMContentLoaded);
                fireReady();
            }
        }
        
    }
        
    function onReady(fn) {
        
        readyFns.push(fn);
        
        if ( ready ) { return fn(); }
        if ( bound ) { return; }
        
        bound = true;
        
        if ( addEventListener ) {
            doc.addEventListener(dcl, DOMContentLoaded, false);
            window.addEventListener('load', fireReady, false); // fallback to window.onload
        } else {
            if ( attachEvent ) {
                
                // IE Event model
                
                doc.attachEvent(orsc, DOMContentLoaded);
                window.attachEvent('onload', fireReady); // fallback to window.onload
                
                try {
                    atTopLevel = !window.frameElement;
                } catch(e) {}
                
                if ( docEl.doScroll && atTopLevel ) {
                    scrollCheck();
                }
                
            }
        }
        
    }
    
    return onReady;
    
}());   

// **



    var
        $,
        window = this,
        document = window.document,
        _ = window.sqwidgetDebug ? (window._ ? window._ : (window.console && window.console.firebug ? window.console.debug : function(){})) : function(){};
        
        _('started console logging in sqwidget');
        // SQWIDGET METHODS THAT ARE NOT JQUERY-DEPENDENT
        // TODO: turn Sqwidget object into a function that passes its arguments to Sqwidget.ready
        this.Sqwidget = Sqwidget = {
            version: '0.21a',
            /** 
             * These can be set from the Sqwidget.globalConfig()
             * All global settings need to be given an initial
             * default value here so they can be set from the globalConfig method 
             */
            settings: { // TODO: Some props (e.g. 'lightbox') would be better as props on Sqwidget.prototype, so they can be modified as instance properties. Perhaps we need global settings and instance settings.
                jQuery: {
                    minVersion: '1.4', // minimum version of jQuery to allow, if already in DOM
                    src: 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
                    //src: 'jquery.js',
                    // Set noConflict properties to true to avoid global '$' and/or 'jQuery' variables in the global namespace. If '$' is false, then 'jQuery' is assumed to be false.
                    noConflict: {
                        $: false,
                        jQuery: false
                    }
                },
                development: false,
                experimental: false,
                automatic: true,
                charset: 'utf-8',
                basePath: '',
                pluginPath: 'plugins/',
            },
            /** Sqwidget's own dependencies. TODO not currently used:  Use it or lose it*/
            dependencies: {
            },
            
            /** 
             * global register of dependencies, keyed by name, containing objects
             * like:
             * {name:'thename', version:'the version', loaded: false, ref:<reference to loaded module>, clients: [] array of client widgets}
             * */
            dependencyRegister: {
            }, 
            
            /** Sqwidget widget templates (classes) keyed by template path */
            widgetTemplates: {},
            
            /** 
             * Sqwidget widget templates by self-declared names
             * TODO still needed
             */
            widgetTemplatesByName: {},
            
            /**
             * Set global configuration (config)
             * @param {Object} dictionary of global config options [optional]
             * return {Object} dictionary of the global config
             */
            globalConfig: function(dict) {
                if (dict) {
                    for(key in dict) {
                        if (key in this.settings) {
                            this.settings[key] = dict[key];
                        }
                    }
                }
                return this.settings;
            },
            
            getConfig: function(key) {
                return this.settings[key];
            },
            
            
            thisDomScript: function(){
                var scripts = document.getElementsByTagName("script");
                return scripts[scripts.length - 1];
            },
     
            /**
             * Load array of scripts into script elements.  
             *
             * Note, there is only one callback function here, called after each is loaded
             *
             * @param {Array} srcs array of source files to load
             * @param {Function} callback 
             * @param {Boolean} inOrder - if true, load scripts in given order
             */
     
            getScripts: function(srcs, callback, inOrder) {
				
				var length = srcs.length,
					loaded = 0;
				
				if (inOrder) {
					// Recursive, each callback re-calls getScripts
					// with a shifted array.
					Sqwidget.getScript(srcs.shift(), function() {
						if (length === 1) {
							callback();
						} else {
						    // preserve inOrder when recursing
							Sqwidget.getScripts(srcs, callback, true);
						}
					});
				} else {
					// Plain old loop
					// Doesn't call callback until all scripts have loaded.
					for (var i = 0; i < length; ++i) {
						Sqwidget.getScript(srcs[i], function(){
							if (++loaded === length) {
								callback();
							}
						});
					}
				}
				
			},
			
            /**
             * Load a script into a <script> element
             * @param {String} src The source url for the script to load
             * @param {Function} callback Called when the script has loaded
             * TODO: 
             * 1) Look in DOM for script element with that src already, and don't load it 
             *    again if found (allows multiple Sqwidget scripts not to keep loading jQuery, etc)
             * 2) {url: src, callback: fn} objects to allow specific callbacks for particular scripts; 
             * 3) {lookForScriptSrcInDOM:false} options object; 
             * 4) callback function when all scripts loaded
             */
            getScript: function(src, callback){
                var head, script, loaded, computedSrc;
                head = document.getElementsByTagName('head')[0];
                callback = callback || function(){};
                script = document.createElement('script');
                computedSrc = src;
                if (this.getConfig('development')) {
                    computedSrc = this.cacheUrl(src, 1/(60*60*24));
                }
                script.src = computedSrc;
                script.onload = script.onreadystatechange = function(){
                    var state = this.readyState;
                    if (!loaded && (!state || state === 'complete' || state === 'loaded')){
                        _('script loaded: ' + src);
                        loaded = true;
                        callback();
                        
                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                        head.removeChild(script); // Worth removing script element once loaded?
                    }
                };
                head.appendChild(script);
            },
            
            /**
             * Build a resource path, sqwidget style, with a base, another bit and
             * a name of something to load.
             * as in basePath + subPath (like pluginPath) + item where any of these can be base or absolute
             * @param {String} base The base, usually going to be settings.basePath.  A '/' path separator will be added to the end of this if missing
             * @param {String} sub The sub path element, like plugins or css or similar.
             * @param {String} item The item name itself (with or without extension)
             * @param {String} extension File extension to be added to item if it doesn't already have one on the end.  This is **without the dot**
             */
            
            buildResourcePath: function(base, sub, item, extension) {
                base = jQuery.trim(base);
                sub = jQuery.trim(sub);
                item = jQuery.trim(item);
                extension = jQuery.trim(extension);
                // check for absolutes
                function isAbsolute(s) {
                    return s.search(/^[a-z]+:\/\//)===0 || s.search(/^\//)===0;
                }
                // if item is absolute, then just return it.
                if (isAbsolute(item)) { 
                    return item; 
                }
                // check for item extension and add if needed
                if (extension.length>0 && !item.match(new RegExp('\.' + extension  + '$'))) {
                    item += '.js';
                }
                if (isAbsolute(sub)) {
                    return sub + item;
                }
                if (base.length>0 && !base.match(/\/$/)) {
                    base += '/';
                }
                return base + sub + item;                
            },
            
            
            
            /**
             * Compare a version string with another, e.g. '1.2.6' with '1.3.2'
             * @returns -1 (a<b), 0 (a==b) or 1 (b>a)
             * TODO: Treat '1.4.0' the same as '1.4'
             */
            compareVersion: function(a, b){
                var i, n = Number;
                    a = a.split('.');
                    b = b.split('.');
     
                    for (i=0; i<a.length; i++){
                            if (typeof b[i] === 'undefined'){
                                    return -1;
                            }
                            else if (n(a[i]) === n(b[i])){
                                    continue;
                            }
                            return (n(a[i]) > n(b[i])) ? -1 : 1;
                    }
                    return (b.length > a.length) ? 1 : 0;
            },
            
            /**
             * Test if a version string is at least as high as the minimum version required
             * @returns boolean true or false
             */
            hasMinVersion: function(testVersion, minVersion){
                return this.compareVersion(minVersion, testVersion) >= 0;
            },
            
            
            /**
              * Return jQuery object or false if minimum version can't be satisfied
              * @param {String} minVersion
              * @returns jQuery object or false
              */
            jQueryIsLoaded: function(minVersion){
                if (!$){
                    var jQuery = window.jQuery;
                    if (jQuery && jQuery.fn && jQuery.fn.jquery &&
                        this.hasMinVersion(jQuery.fn.jquery, minVersion || this.settings.jQuery.minVersion)){
                        $ = jQuery;
                    }
                }
                return $;
            },
            
            
            /**
             * Call callback when jQuery is ready
             * @param {function} callback callback function to call when jquery ready
             *
             * TODO: allow optional priority of execution, as with WordPress filters
             */
            onjQueryReady: function(callback){
                _('Sqwidget.onjQueryReady');
                var jQuery, jQuerySettings, callbacks;      
                
                if (!$){
                    jQuery = this.jQueryIsLoaded();
                    if (jQuery){
                        _('jQuery found');
                        $ = jQuery;
                    }
                    else {
                        _('jQuery not found');
                        jQuerySettings = this.settings.jQuery;
                        
                        // If this called for the first time, create array to store callbacks
                        callbacks = this.onjQueryReady.callbacks;
                        if (!callbacks){
                            callbacks = this.onjQueryReady.callbacks = [];
                            // load jQuery
                            this.getScript(jQuerySettings.src, function(){
                                var
                                    jQuery = window.jQuery,
                                    $ = jQuery;
                                
                                // Hide or expose global '$' and 'jQuery' vars, depending on settings
                                if (jQuerySettings.noConflict.$){
                                    jQuery.noConflict(jQuerySettings.noConflict.jQuery);
                                }
                                
                                // once loaded, pass jQuery to each stored callback
                                $.each(callbacks, function(){
                                    callbacks.shift()($);
                                });
                            });
                        }
                        // Add callback to stack
                        callbacks.push(callback);
                        return;
                    }
                }
                callback($);
            },
            
            // Sqwidget ready
            // TODO this requires DOM ready and jqyery and dependencies ready
            ready: function(callback){
                this.onjQueryReady(function() {
                    Sqwidget.domReady(callback);
                });
            },

            
            // Document DOM ready
            domReady: function(callback){
                jQuery().ready(callback);
            },
            /**
             * @returns {Array} of the full set of widgets in the DOM, returning them as 
             * as an array of SqwidgetWidget objects:
             *
             */
            widgetsInDom: function(){
                function trim(str){
                    return str.replace(/^[\0\t\n\v\f\r\s]+|[\0\t\n\v\f\r\s]+$/g, '');
                }
                
                function type(templateUrl){
                    return templateUrl.replace(/^.*\/([\w]+)(?:\.[^\/]+)?$|^([\w]+)(?:\..*)?$/, '$1$2');
                }

                function settings(str){
                    if (!str){
                        return {};
                    }
                
                    var
                        keyvalPairs = str.split(','),
                        len = keyvalPairs.length,
                        widgetSettings = {},
                        keyval, i, pos;

                    for (i = len; i; i--){
                        keyval = keyvalPairs[i-1];
                        pos = keyval.indexOf(':');
                        if (pos !== -1){
                             widgetSettings[trim(keyval.slice(0,pos))] = trim(keyval.slice(pos+1));
                        }
                    }
                    return widgetSettings;
                }
            
                // Find 'div[data-sqwidget]'                    
                var
                    divs = document.getElementsByTagName('div'),
                    len = divs.length,
                    widgets = [],
                    div, dataSqwidgetSettings, dataSqwidget, widgetType, i;
                
                for (i = 0; i<divs.length; i++){
                    div = divs[i];
                    dataSqwidget = div.getAttribute('data-sqwidget');
                    dataSqwidgetSettings = div.getAttribute('data-sqwidget-settings');
                    
                    if (dataSqwidget){
                        dataSqwidget = settings(dataSqwidget);
                        dataSqwidgetSettings = settings(dataSqwidgetSettings);
                        widgetType = type(dataSqwidget.template || 'generic');
                        
                        widgets.push(
                            Widget(this, widgetType, div, dataSqwidget, dataSqwidgetSettings));
                    }
                }
                return widgets;
            },
            
            /**
             * Return SqwidgetTemplate for the given template name, creating it if not available
             * @param templateFilename - The template filename (including extension), like templatename.html or 
             * similar.
             * @return {SqwidgetTemplate} the template
             */
            getTemplate: function(templateFilename) {
                // check to see if already loaded, if so, return instance.
                var name = jQuery.trim(templateFilename);
                var fullName = this.buildResourcePath(this.settings.basePath, '', templateFilename, 'html');
                var t = this.widgetTemplates[fullName];
                if (!t) {
                    t = Template(this, fullName);
                    this.widgetTemplates[fullName] = t;
                }
                return t;
            },
            
            /**
             * Retrieve widget template by name (to do something like call a listener/callback
             * with JSONP data for example)
             */
            getTemplateByName: function(templateName) {
                return this.widgetTemplatesByName[templateName];
            },
            
            /**
             *  Set name for the given template.
             *  Note, if a widget is reconfigured, it will get registered against a second name
             */
            setTemplateName: function(template, name) {
                this.widgetTemplatesByName[name] = template;
            },
            
             /**
             * Load dependencies (check that versions are satisfied, and issue script loading instructions
             * as needed)
             * @param {Object:Template} template object that wants this dependency
             * @param {Object} dependency a dependency in the form ['name', 'version'] or simply 'name'
             *
             */

            addDependency: function(widget,dependency) {  
                var 
                    name = null,
                    minVersion = null,
                    depConfig = {};
                    
                if (typeof(dependency) === 'string') {
                    name = dependency;
                }
                else {
                    name = dependency[0];
                    if (typeof(dependency[1]) === 'object') {
                        depConfig = dependency[1];
                    }
                    else {
                        minVersion = dependency[1];
                    }
                    if (typeof(dependency[2]) === 'object') {
                        depConfig = dependency[2];
                    }
                }
                _('adding dependency ' + name);
                var existing = this.dependencyRegister[name];
                if (existing) {
                    //TODO version comparison
                    existing.clients.push(widget);
                    if (existing.loaded) {
                        widget.setPlugin(existing.name, existing.module, depConfig);
                    }
                }
                else {
                    this.dependencyRegister[name] = {name:name, version:minVersion, loaded: false, module:null, clients:[widget], config:depConfig};
                    // initiate load
                    var loadPath = this.buildResourcePath(this.settings.basePath, this.settings.pluginPath, name, 'js');
                    this.getScript(loadPath, function(){});
                    
                }
            },
            
            getDependencyRegister: function() {
                return this.dependencyRegister;
            },
            
            /**
             * Review all dependencies
             * @return {Boolean} true if all dependencies satisfied
             */
            checkDependencies: function(widgetClient) {
                for (d in this.dependencyRegister) {
                    if (this.dependencyRegister.hasOwnProperty(d)) {
                        if (widgetClient in this.dependencyRegister[d].clients) {
                            if (!(this.dependencyRegister[d].loaded)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            },
            
            /**
             * Called by plugins to register themselves
             * @param {String} name the namespace name for this thing
             * @param {Object} module the module constructor. Call to create an object of this type
             * @param {String} version the version of this plugin 
             *
             */
             
            plugin: function(name, module, version) {
                var dep = this.dependencyRegister[name];
                dep.module = module;
                dep.loaded = true;
                dep.version = version;
                for (client in dep.clients) {
                    dep.clients[client].setPlugin(name, module, dep.config);
                }
            },
            

            
            
            
            
            
            
        };
        

        /////


// Sqwidget - extend Sqwidget once jQuery is loaded, and assign to Sqwidget
// *********
    Sqwidget.onjQueryReady(function(jQuery){
        var $ = jQuery, namespace, cloneFn, cachedFuncs;
        
        namespace = 'sqwidget';
        function ns(props, delimiter){
            delimiter = delimiter || '-';
            if (!props){
                return namespace;
            }
            else if (typeof props === 'string'){
                    return namespace + delimiter + props;
            }
            else {
                return [namespace].concat(props).join(delimiter);
            }
        }
        
        // TEMP
        //window.jQuery = $;
        
        // Store original jQuery functions so that when we extend them for Sqwidget, we can restore them for non-Sqwidget uses
        cloneFn = $.extend({}).fn;
        cachedFuncs = {
            css: cloneFn.css,
            show: cloneFn.show,
            hide: cloneFn.hide
        };
        
            
        // EXTEND JQUERY
        // =============


// **

        // NEW JQUERY ELEMENT METHODS
        
        $.extend(
            $.fn,
            {
                // TODO: Lazy load CleanslateCSS, or allow it to be preloaded

                // TODO: Integrate with .css(), allowing third argument to be !important boolean; allow option for method to be cssImportant() or the third arg in css()
                cssImportant: function(key, value){
                    var prop, $el;
                    $el = this;
                    
                    // If just getting value, then use default CSS method
                    if (typeof key !== 'object' && typeof value === 'undefined'){
                        return cachedFuncs.css.apply(this, arguments);
                    }
                    
                    // Create object, if arg is a string
                    if (typeof key === 'string'){
                        prop = key;
                        key = {};
                        key[prop] = value;
                    }
                    
                    $.each(key, function(key, value){ // if value === null, then remove from style attr        
                        var style, rule;
                        style = $el.attr('style') || '';
                            
                        rule = (value !== null) ? key + ':' + value + ' !important;' : '';
                        if (style.toLowerCase().indexOf(key.toLowerCase()) !== -1){
                            style = style.replace(new RegExp(key + '\\s*:\\s*[^;]*(;|$)', 'i'), rule);
                        }
                        else {
                            style = $.trim(style);
                            if (style !== ''){
                                if (style.slice(-1) !== ';'){
                                    style += ';';
                                }
                                style += ' ';
                            }
                            style += rule;
                        }          
                        $el.attr('style', style);
                    });
                    return $el;
                },
                
                css: function(){
                    var args, doImportant;
                    args = arguments;
                    doImportant = (typeof args[0] === 'string' && args.length > 2) || (typeof args[1] === 'string' && args.length > 2) &&  args.length > 1 && arguments[arguments.length-1] === true;
                    return (doImportant ? this.cssImportant : cachedFuncs.css).apply(this, arguments);
                }
            }
        );
        
        // ****
        
        // EXTEND SQWIDGET WITH JQUERY-DEPENDENT PROPS
        this.Sqwidget = Sqwidget = $.extend(
            // Constructor
        /*    function(data, callback){
                Sqwidget.widgets.push(this);
                
                if (typeof data === 'object'){
                    $.extend(this, data, {uid:Sqwidget.uid()});
                }
                if (typeof callback === 'function'){
                    callback.call(this, $);
                }
            }, */
            // Original Sqwidget object
            Sqwidget,
            {
                // Static Methods & Properties
                // TODO: Confirm that the methods on Sqwidget and those on Sqwidget.prototype are in their correct place. What should be the guideline about whether a method is a static method, or an instance method? Some methods (e.g. uid()) are called by static objects (e.g. Lightbox), so they need to remain static methods - or both be moved to the prototype.
                //TODO separate widget template functions from sqwidget page management
                // do as: Lightbox.uid = Sqwidget.prototype.uid
                
                widgets: [],

                isElement: function(obj){
                    return obj && obj.nodeType === 1;
                },

                isJQuery: function(obj){
                    return obj && !!obj.jquery;
                },

                // Test whether the str is *probably* a url. It does not attempt to validate the url.
                isUrl: function(str){
                    return (/^https?:\/\/[\-\w]+\.\w[\-\w]+\S*$/).test(str);
                },

                uid: function(significantFigures){
                    var M = Math;
                    return M.round(M.pow(M.pow(10, significantFigures || 8), M.random()));
                },
                
                cssPresets: {        
                    contentonly: {
                        margin:0,
                        padding:0,
                        borderWidth:0
                    }
                },
                
                // Notify the global window object about desired internal events of a Sqwidget object
                    // E.g. bind listener to window:
                    //   $(window).bind('sqwidget', function(jQueryEventObject, sqwidgetEvent){
                    //     if (sqwidgetEvent.type === 'overlay.add'){
                    //       doStuff(sqwidgetEvent.origin);
                    //     }
                    //   });
                notifyGlobalWindow: function(origin, eventTypes, namespace){ // origin is originating object (e.g. Overlay instance), eventTypes is array (e.g. ['add', 'remove']), namespace is optional - if not provided, the origin must have a 'type' property (e.g. 'overlay')
                    
                    $.each(eventTypes, function(i, type){
                        try {
                            $(origin)
                                .bind(type, function(){
                                    $(window).trigger(ns(), {type: (namespace || origin.type) + '.' + type, origin:this});
                                });
                        }
                        catch(e){
                            _('catch', $);
                        }
                    });
                },
                
                // Setter: Add a query string parameter to a url. E.g. addUrlParam('http://example.com?v=1', 'this', 'that');
                // TODO: Getter: if no value supplied, then get param value
                urlParam: function(url, param, value){
                    return url + (!/\?/.test(url) ? '?' : '&') + param + '=' + value;
                },
                
                // Return a fixed number (which may be considered arbitrary) when passed an interval of time (in days; may be decimal part of day, e.g. 1/24 for 1 hour)
                // Useful for breaking server caching of resources after a specified interval of time. E.g. "http://example.com/data.js?cache=" + timeChunk(30);
                timeChunk: function(intervalDays){
                    var decimalPlaces, baseline, msInADay, interval, now, chunk;
                    decimalPlaces = 6; // Allows accuracy to nearest minute
                    baseline = new Date(2009, 0, 1).getTime(); // Used simply to keep the number of chars down
                    msInADay = 24 * 60 * 60 * 1000;
                    interval = intervalDays * msInADay;
                    now = new Date().getTime();
                    chunk = now - (now % Math.round(interval)); // Math.round used to avoid JavaScript float point error
                    return Number(((chunk - baseline) / msInADay).toFixed(decimalPlaces)) || 0;
                },
                
                cacheUrl: function(url, intervalDays){
                    return this.urlParam(url, 'cache', this.timeChunk(intervalDays));
                },
                
                
                // E.g.
                // var ns = new Sqwidget.Namespace('blah');
                // ns([ns(['hi','there','you'], '.'),ns(['all','is','full','of','love'])], ' -//- ');
                //  Result:
                //  "blah -//- blah.hi.there.you -//- blah-all-is-full-of-love"
                /*
                Namespace: function(namespace, defaultDelimiter){
                    return function(props, delimiter){
                        delimiter = delimiter || defaultDelimiter || '-';
                        if (!props){
                            return namespace;
                        }
                        else if (typeof props === 'string'){
                                return namespace + delimiter + props;
                        }
                        else {
                            return [namespace].concat(props).join(delimiter);
                        }
                    };
                },
                */

                // ================

                // Instance methods
                prototype: $.extend( // TODO: Decide if a number of these prototype methods should be moved to static functions on the Sqwidget object
                    function(){},
                    {

                        // Insert widget HTML, DOM node or jQuery object into the DOM, afer the <script> element that originally created the widget instance. This position is cached, for later retri  .
                        // Optional args: insertPosition to override last in body; verb to use for adding content - default 'after' (could use 'before', 'append', 'prepend', etc)
                        // TODO: clarify how this is connected with method to replace DOM contents (e.g. as .html(newContents))
                        // TODO: Does this really need to store the insertPosition? In fact, is this method even required?
                        insert: function(contents, insertPosition, verb){
                            var $context = this.insertPosition = $(insertPosition || this.insertPosition || this.thisDomScript());
                            if (!$context){
                                return false;
                            }
                            // If no arguments, return the current context
                            if (!contents){
                                return $context;
                            }
                            $context[verb || 'after'](contents);
                            return $(contents);
                        },
                        
                        // Truncate a str to a specific number of words; optional arg: trailer string - default '…'
                        truncate: function(str, numWords, trailer){
                            var newStr = String(str).replace(new RegExp('^((\\W*\\w*\\b){0,' + numWords + '}\\.?).*$', 'm'), '$1');
                            return newStr + (newStr.length < str.length ? (trailer || '\u2026') : '');
                        },
                    
                        // Repeat a string num times 
                        repeat: function(str, repeats){
                            return repeats > 0 ? new Array(repeats + 1).join(str) : '';
                        },
                        
                        // Return a number with leading zeroes, up to total length of number string
                        leadingZeroes: function(num, totalLength) {
                            return this.repeat('0', (totalLength || 2) - String(num).length) + num;
                        },
 
                        // Parse an atom date string and return as a JS Date object. E.g. '2007-10-29T23:39:38+06:00'
                        // TODO: Detect if arg is Date obj, and return as Atom date string
                        atomDate: function(atomDateStr){
                            var d, n, plusminus;
                            
                            // Convert 'Z' UTC to '+00:00' and split to array
                            atomDateStr = atomDateStr.replace(/z$/i, '+00:00');
                            d = atomDateStr.split(/[\-T:+]/);  // TODO: Confirm this is fine in IE6
                            n = Number;
                                
                            if (d.length !== 8){
                                return false;
                            }              
                            // Timezone + / -
                            plusminus = atomDateStr.substr(19,1);
                            
                                return new Date(
                                Date.UTC(
                                    n(d[0]),            // year
                                    n(d[1] - 1),        // month
                                    n(d[2]),            // day
                                    n(d[3] - n(plusminus + d[6])),  // hour
                                    n(d[4] - n(plusminus + d[7])),  // mins
                                    n(d[5])              // secs
                                )
                            );
                        },
                        
                    
                        loadCss: function(css, cacheTime){
                            cacheTime = cacheTime || this.settings.cssCacheTime;
                            
                            // Simple check to tell difference between css text and a url - this does not attempt to validate CSS
                            // Check for '@' or "{" - e.g. with @import or div{color:red};
                            function isCss(str){
                                return (/@|\{/m).test(str);
                            }
                            $('head')
                                .append(isCss(css) ? 
                                    '<style type="text/css">' + css + '</style>' :
                                    '<link type="text/css" rel="stylesheet" href="' + (cacheTime ? this.cacheUrl(css, cacheTime) : css) + '" />'
                                );
                        },
    
                        // Modified from John Resig's http://ejohn.org/blog/javascript-micro-templating
                        // TODO make this pluggable
                        tmpl: function tmpl(str, data){
                            var fn = new Function("obj",
                                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                                // Introduce the data as local variables using with(){}
                                "with(obj){p.push('" +
                                // Convert the template into pure JavaScript
                                str
                                    .replace(/[\r\t\n]/g, " ")
                                    .split("<%").join("\t")
                                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                                    .replace(/\t=(.*?)%>/g, "',$1,'")
                                    .split("\t").join("');")
                                    .split("%>").join("p.push('")
                                    .split("\r").join("\\'") +
                                "');}return p.join('');");
                            
                            // Apply function to data, with this widget accessible via 'this' or 'that' variables
                            return fn.call(this, $.extend(true, {$:$, sqwidget:this}, data));
                        }
                    }
                )
            }
        );
    });
    
    
    /**
     * Sqwidget template object.  One per template file (which can have >1 template defined in it)
     * @param sqwidget ref to global Sqwidget object
     * @param url the url to load the template from (this comes from data-sqwidget settings for template:)
     * @return a SqwigetTemplate object
        */
    
    var Template = function(sqwidget, templateName) {
        var self = {}; //neoclassical
        var sqwidget = sqwidget;
        var templateName = templateName;
        /** set of widgets (instances on the page) for this template */
        var widgets = [];
        var templates = {};
        /** javascript blocks to be executed in context of widget */
        var scripts = [];
        var styles = [];
        var templateText = '';
        var loaded = false;
        var dependenciesLoaded = false;
        /** errors noted on template load */
        var errors = [];
        /** template config. default values here */
        var templateConfig = {
            "name": "sqwidget_template",
             "version": "1",
             "title": "Generic sqwidget widget",
             "desc": "-",
             "url": "http://github.com/sqwidget", 
             "ui" : "hostpage",
             "dependencies": {
             },
             "settings": {
                 
             }
        };

        // PRIVATE methods
        var loadTemplate = function() {
            _('template name is ' + templateName);
            //path to the base 
            jQuery.get(templateName, function(data, textStatus, request) {
                // on template loaded
                _('template data: ' + data);
                _('template text status: ' + textStatus);
                if (data.length === 0 || textStatus != 'success') {
                    // template load failed
                    errors.push('loading of template ' + templateName + ' failed.');
                }
                else {
                    _('template loaded');                
                    templateText = data;
                    parseTemplateFile(templateText);
                    // TODO put somewhere generically useful
                    function props(a) {
                         var r = [];
                         for (key in a) {
                             r.push(key + ': "' + a[key] + '"');
                         }
                         return '{' + r.join(' ') + '}';
                     }
                    _('templates: ' + props(templates));
                    loaded = true;
                }
                if (errors.length ===0) {
                    // set default body into widgets
                    // maybe don't do this here
                    setLoading();
                    // run controllers to set up dependencies via template.config, and
                    // then resolve and load dependencies
                    initWidgets();
                    //runControllers();
                    if (errors.length !==0) {
                        showErrorsInWidgets();
                    }
                }
                else {
                    showErrorsInWidgets();
                }
            });
        };      
        
        var parseTemplateFile = function(template) {
            _('parsing template file for ' + templateName);
            // TODO document type detection (doctype tells us it is HTML or similar)
            // For now: default body html stored -- and activated immediately
            var containsHead, templateSplit, head, templateStr, head=null, body=null;

            containsHead = template.match(/^((?!<script)[\w\W])*<head>/);
            if (containsHead){
                templateSplit = template.match(/^((?!<script)[\w\W])*?<head>([\w\W]*)<\/head>([\w\W]*?)$/);
                head = jQuery.trim(templateSplit[2]);
                _(' Head is ' + head);
                templateStr = head;
            }
            else {
                templateStr = template;
            }
            // flush out body
            bodystr = template.match(/<body[^>]*>([\w\W]*)<\/body>([\w\W]*?)$/);
            body = bodystr[1];
            _(' Body is ' + body);
            if (body !== null) {
                templates['default'] = body;
            }
            // grab script templates - from the HEAD only for templates other than the default
            var j = jQuery(templateStr);
            j.filter('script[type=text/template][id]')
             .each(function(i, t){
                t = jQuery(t);
                templates[t.attr('id')] = jQuery.trim(t.html());
            });
            
            //
            // grab javascripts from head and execute in order
            //
            j.filter('script:not([type]), script[type=text/javascript]')
             .each(function(i, t){
                t = jQuery(t);
                scripts.push(t.text());
            }); 
            
            // capture css
            // and move
            // TODO -- capture media attributes as well
            j.filter('style')
             .each(function(i, t) {
                 t = jQuery(t);
                 styles.push({text:t.text(),media:t.attr('media'), type:t.attr('type'), title:t.attr('title')} );
             });
            //TODO hook for style injection -- not done for now
            // modes -- simple injection with container div added
            for (s in styles) {
                var ss = jQuery('<style></style>').attr({title:styles[s].title, type:styles[s].type, media:styles[s].media}).text(styles[s].text);
                jQuery('head').append(ss);
            }
        };
        
        var setLoading = function() {
            for (w in widgets) {
                // render default template if there is one
                widgets[w].showLoading();
            }
        };
        
        var initWidgets = function() {
            for (w in widgets) {
                _('running controller for ' + widgets[w].toString());
                widgets[w].onTemplateLoaded();
            }            
        };
        
        var showErrorsInWidgets = function() {
            if (sqwidget.settings.development) {
                for (w in widgets) {
                    widgets[w].render('<div style="color: red;border:1px dashed red;">Sqwidget Errors:<ul><li>' + errors.join('</li><li>') + '</li></ul></div>');
                }
            }
        };
        
        
        // PUBLIC methods   
        /**
         * Register this widget with this template
         *
         */
        self.register = function(widget) {
            widgets.push(widget);
        };

        self.config = function(dict) {
            if (dict) {
                for(key in dict) {
                    if (key in templateConfig) {
                        templateConfig[key] = dict[key];
                    }
                }
                sqwidget.setTemplateName(self, templateConfig.name);
            }
            return templateConfig;
        };
        
        self.getConfig = function(key){
            return templateConfig[key];
        };
        
        self.loadDependencies = function(widget) {
            for (i in templateConfig.dependencies) {
                sqwidget.addDependency(widget, templateConfig.dependencies[i]);
            }
        };

        self.getScripts = function() {
            return scripts;
        };
        
        self.getTemplate = function(name) {
            return templates[name];
        }
        
        self.setPlugin = function(name, module) {
            plugins[name] = module;
        };
        
        self.getStyles = function() {
            return styles;
        }

        // Load the template now
        loadTemplate();
        
        return self;
    };
    
    /**
     * SqwidgetWidget is the actual widget, which has an element to 
     * be displayed in and has private settings and is linked to a template
     * @param sqwidgetTemplate ref to the template for this wiget
     * @param div ref to DOM element (TODO what object is passed in here)
     * TODO make Widget and Template
     */
    var Widget = function (sqwidget, type, div, dataSqwidget, dataSqwidgetSettings) {
        var 
            self = {},
            sqwidget = sqwidget,
            widgetType = type,
            container = div,
            dataSqwidget = dataSqwidget,
            settings = dataSqwidgetSettings,
            template = null,
            plugins={},
            readyFn = null,
            errorFn = null,
            loadingFn = null,
            readyRun=false;
        /**
         * eval script in the context of this object
         * @param {String} string of script to eval. Should be text/javascript
         * @return {undefined}
         */
        var evalScript = function(evalScript) {
            _('eval script is ' + evalScript);
            var widget = self;
            //TODO minimise context for controller functions
            eval(evalScript.toString());
        };
        
        /**
         * TODO
         * Check we have all plugins namespaced, er how do we know
         */
        var allPluginsLoaded = function() {
            return sqwidget.checkDependencies(self);
        };
         
        /**
         * set template config dict
         * This used to allow widget.config({..}); in intial embed
         */
        self.config = function(dict) {
            template.config(dict);
        };
        
        self.onTemplateLoaded= function() {
            self.runController(template.getScripts());    
            template.loadDependencies(self);  
        };
        
        self.setPlugin = function(name, module, config) {
            plugins[name] = module(sqwidget, self, jQuery, config);
            //TODO check all plugins loaded
            if (allPluginsLoaded()) {
                if (!readyRun) {
                    readyRun=true;
                    if (readyFn) {
                        var widget=self;
                        _('running ready() for widget ' + container.id);
                        readyFn.call(self);
                    }
                    else {
                        //TODO decide what extra contents will be displayed here
                        self.setTemplate('default', null, {});
                    }
                }
            }
        };
        
        //TODO fit this into the proper place
        ui = {
            head: function(content) {
                $('head').append(content)
            },
            body: function(content){
               container.empty().append(content);
            }
        };
        
        /**
         * Register controller function(s) to be executed when all plugins loaded
         *
         */
         
        self.ready = function(fn) {
            readyFn = fn;
        };
        
        self.loading = function(fn) {
            loadingFn = fn;
        };
        
        self.error = function(fn) {
            errorFn = fn;
        }
        
        /*
        // set the ui engine
        instance.ui = template.config.ui || sqwidget.defaultConfig.ui;
        
        // create the main ui for this widget instance
        instance.main = instance.ui();
        // add style to document head (using default ui engine)
        instance.main.head('<style></style>');
        instance.main.body('<p>blah</p>');
        instance.main.body.template = template.templates['default'];
        instance.main.body(mainTemplate, dataJson);
        
        instance.lightbox = instance.ui('appleofmyiframe');
        instance.lightbox.template = templates.lightbox;
        instance.lightbox.body('<p>blah</p>');
        */
        
        // TODO put somewhere generically useful
        var props = function(a) {
            var r = [];
            for (key in a) {
                r.push(key + ': "' + a[key] + '"');
            }
            return '{' + r.join(' ') + '}';
        };
        
        // PUBLIC METHODS
        
        /**
         * Get this widget up and running
         */
        self.init = function() {
            //attach ourselves to template -- this also loads the template if that hasn't happened before
            var sqTemplate = sqwidget.getTemplate(dataSqwidget.template);
            template = sqTemplate;
            sqTemplate.register(self);
        };
                
        /**
         * Get a setting from, here or template or global config
         * @param {String} key key to search for
         * @param {Object} default Default value to apply if none comes from config
         * @returns {Object} settings or config value
         * Hierarchy here is data-sqwidget-settings, template config settings
         */
        self.getSetting = function(key, defaultValue) {
            return settings[key] || template.getSettings(key) || defaultValue;
        };

        /**
         * Get a config item from widget here or template or global config
         * @param {String} key key to search for
         * @param {Object} default Default value to apply if none comes from config
         * @returns {Object} settings or config value
         * Hierarchy here is data-sqwidget, template config
         */        
        self.getConfig = function(key, defaultValue) {
            return dataSqwidget[key] || template.getConfig(key) || sqwidget.getConfig(key) || defaultValue;
        };
        
        
        /**
         * Render html into this widget
         * @param {String} html Inner html to be rendered into the div for this widget
         * @param {jQuery} place The place to render into [optional]. Otherwise, 
         * TODO: cache, keep existing content to pop out etc -- page management kind of stuff
         */ 
        self.render = function(html, place, contents) {
            var s = self.renderTemplate(html, contents);
            var p = place || container;
            jQuery(p).html(s);
        };
       
       /**
        * Show the loading template
        */
       self.showLoading = function() {
           if (loadingFn) {
               var widget=self;
               loadingFn.call(self);
           }
           else {
               var t = template.getTemplate('loading');
               if (t) {
                   self.render(t);
               }
           }
       };
       
       /**
        * Render contents with named template
        * TODO complete docs here 
        */
       self.renderWithTemplate = function (name, contents) {
           var d = template.getTemplate(name);
           return self.renderTemplate(d,contents);
           
       };
       /**
        * Render html into this widget
        * @param {String} html Inner html to be rendered into the div for this widget
        * @param {jQuery} place The place to render into [optional]. Otherwise, 
        * TODO: cache, keep existing content to pop out etc -- page management kind of stuff
        */        
       self.setTemplate = function(name, place, contents) {
           var d = template.getTemplate(name);
           if (d) {
               self.render(d, place, contents);
           }
       };

       /**
        * Modified from John Resig's http://ejohn.org/blog/javascript-micro-templating
        * @param {String} str data to have template tag matching performed on
        * @param {Object} data Data to render into template as keyed values
        */
       self.renderTemplate =  function (str, data){
           var fn = new Function("obj",
               "var p=[],print=function(){p.push.apply(p,arguments);};" +
               // Introduce the data as local variables using with(){}
               "with(obj){p.push('" +
               // Convert the template into pure JavaScript
               str
                   .replace(/[\r\t\n]/g, " ")
                   .split("{{").join("\t")
                   .replace(/((^|}})[^\t]*)'/g, "$1\r")
                   .replace(/\t(.*?)\}\}/g, "',$1,'")
                   .split("\t").join("');")
                   .split("}}").join("p.push('")
                   .split("\r").join("\\'") +
               "');}return p.join('');");
            
            return fn.call(this, jQuery.extend(true, {jQuery:jQuery, sqwidget:sqwidget, widget:self}, data));
        };
        
        /**
         * Run the script controller
         */
        self.runController = function(scripts) {
            for (s in scripts) {
                evalScript(scripts[s]);
            }
        };
        
        /**
         * toString to expose widget params
         * @return {String}
         */
         
        self.toString = function( ) {
            return 'type: ' + widgetType + ' container id: ' + div.id + ' dataSqwidget: ' + props(dataSqwidget) + ' dataSqwidgetSettings: ' + props(settings);
        };
        
        return self;
    };
    
    // TEMP global exposure to play with classes

    window.SqwidgetTemplate = Template;
    window.SqwidgetWidget = Widget;

        

    
}());


// On DOM ready loading to be done
// TODO proper metaphors for calling this
// a default function here, but can be overridden if called by the doc?

Sqwidget.ready(function() {
    if (Sqwidget.settings.automatic) {
        _('sqwidget (on automatic) loading and starting widgets ');
    
        // get widgets in the page as Widget objects
        var widgets = Sqwidget.widgetsInDom();
    
        _('found ' + widgets.length.toString() +' widget divs:');
    
        for (w in widgets) {
            _(' ' + widgets[w].toString());
        }
        _('initing widgets...');
        // load templates as needed
        for (w in widgets) {
            _('init for w: ' + widgets[w].toString());
            widgets[w].init();
        }
        
        
    }
});

 
 
/*jslint onevar: true, browser: true, devel: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */