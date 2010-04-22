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
            version: '0.2bbc', //TODO require version management here?
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
                }
            },
            /** Sqwidget's own dependencies */
            dependencies: {},
            
            /** Sqwidget widget templates (classes) keyed by widget name */
            widgetTemplates: {},
            
            
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
                var head, script, loaded;
                head = document.getElementsByTagName('head')[0];
                callback = callback || function(){};
                script = document.createElement('script');
                script.src = src;
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
                _('Sqwidget.ready');
                return this.onjQueryReady(callback);
            },
            
            // Document DOM ready
            domReady: ready,
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
                            new Widget(this, widgetType, div, dataSqwidget, dataSqwidgetSettings));
                    }
                }
                return widgets;
            },
            
            /**
             * Return SqwidgetTemplate for the given template name, creating it if not available
             * @param templateName - The template filename (including extension), like templatename.html or 
             * similar.
             * @return {SqwidgetTemplate} the template
             */
            getTemplate: function(templateName) {
                // check to see if already loaded, if so, return instance.
                var name = jQuery.trim(templateName);
                var t = this.widgetTemplates[name];
                if (!t) {
                    t = new Template(this, name);
                    this.widgetTemplates[name] = t;
                }
                return t;
            },
            
            
            
            
            /**
             * Register a widget
             * This called from the head of an associated widget document.  
             * This is where register a widget's properties and dependencies.
             * Sqwidget grabs
             * and keeps a copy of these, and then leads on to load dependencies.  So, this is called
             * either as a part of parsing the widget html or json and evaling the head script element where
             * it is defined.  Or it may be invoked if standalone-sqwidget.js (or however named) is provided
             *
             * @param properties Object containing properties defining this widget instance.
             */
            register: function(properties) {
                _('Sqwidget,register() with props');
                // parse and store properties
                
                
                
                // invoke dependencies and load anything that is needed
                loadDependencies()
                 
            },
            
            /**
             * Load dependencies (check that versions are satisfied, and issue script loading instructions
             * as needed)
             *
             */
            
            loadDependencies: function(dependencies_block) {
                
        
            },
            
            /**
             * Load and parse widget template
             * @param url The url to load the template from.  This is typically given in a 
             * data-sqwidget block in the div where a widget is to be inserted.
             * TODO is this the correct structure for doing this?
             * TODO where do errors get reported?  options for this?
             */
            loadWidgetTemplate: function(url) {
                
                
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
// JQUERY-DEPENDENT PLUGIN DEPENDENCIES

/*!
* AppleOfMyIframe
*   github.com/premasagar/appleofmyiframe
*
*//*
    JavaScript library for creating & manipulating iframe documents on-the-fly     

    by Premasagar Rose
        dharmafly.com

    license
        opensource.org/licenses/mit-license.php


    requires jQuery (best with jQuery v1.4+)
    creates methods
        jQuery.iframe()
        jQuery(elem).intoIframe()
        
    **
    
    contributors
        Alastair James: github.com/onewheelgood
        Jonathan Lister: github.com/jayfresh
    
    **
    
    3KB minified & gzipped

*/

    /*
    * Throttle
    *   github.com/premasagar/mishmash/tree/master/throttle/
    *
    */
    (function($){
        function throttle(handler, interval, defer){
            var context = this;
            interval = interval || 250; // milliseconds
            // defer is false by default
            
            return function(){
                if (!handler.throttling){
                    handler.throttling = true;
                    
                    window.setTimeout(function(){
                        if (defer){
                            handler.call(context);
                        }                            
                        handler.throttling = false;
                    }, interval);
                    
                    if (!defer){
                        handler.call(context);
                    }
                }
                return context;
            };
        }

        // jQuery.throttle
        $.throttle = throttle;
        
        // jQuery(elem).throttle
        $.fn.throttle = function(eventType, handler, interval, defer){
            return $(this).bind(eventType, throttle(handler, interval, defer));
        };
    }(jQuery));


// **


(function($){
    // Anon and on
    function isUrl(str){
        return (/^https?:\/\/[\-\w]+\.\w[\-\w]+\S*$/).test(str);
    }
    function isElement(obj){
        return obj && obj.nodeType === 1;
    }
    function isJQuery(obj){
        return obj && !!obj.jquery;
    }  
    // Utility class to create jquery extension class easily
    // Mixin the passed argument with a clone of the jQuery prototype
    function JqueryClass(proto){
        return $.extend(
            function(){
                this.init.apply(this, arguments);
            },
            {
                // deep clone of jQuery prototype and passed prototype
                prototype: $.extend(true, {}, $.fn, proto)
            }
        );
    }


    var
        // AOMI script version
        version = '0.25',
    
        // Namespace
        ns = 'aomi',
        
        // Environment
        win = window,
        
        // Browsers
        browser = $.browser,
        msie = browser.msie,
        ie6 = (msie && win.parseInt(browser.version, 10) === 6),
        
        // Browser behaviour booleans
        documentDestroyedOnIframeMove = !msie,
        externalIframesInvisibleOnAppend = ie6,
        
        // Shortcuts
        event = $.event,
        
        // Settings        
        cssPlain = {
            margin:0,
            padding:0,
            borderWidth:0,
            borderStyle:'none',
            backgroundColor:'transparent'
        },
        
        defaultOptions = {
            attr:{
                scrolling:'no',
                frameBorder:0,
                allowTransparency:true
            },
            src:'about:blank', // don't include in attr object, or unexpected triggering of 'load' event may happen on applying attributes
            doctype:5, // html5 doctype
            target:'_parent', // which window to open links in, by default - set to '_self' or '_blank' if necessary
            autoheight:true, // shrink the iframe element to the height of its document body
            autowidth:false,
            resizeThrottle:250, // minimum delay between aomi.resize calls (milliseconds)
            css:$.extend(
                {width:'100%'}, // ensures that iframe element stretches to fill the containing width
                cssPlain
            ),
            title:'' // a title for the iframe document
        },
                
        // Main class
        AppleOfMyIframe = new JqueryClass(
            $.extend({
                init: function(){
                    var 
                        aomi = this,
                        // Cache the constructor arguments, to enable later reloading
                        args = this._args($.makeArray(arguments))
                            ._args(), // retrieve the sorted arguments
                        options = this.options(),
                        autowidth = options.autowidth,
                        autoheight = options.autoheight,
                        firstResize, fromReload;
                    
                    // If a url supplied, add it as the iframe src, to load the page
                    // NOTE: iframes intented to display external documents must have the src passed as the bodyContents arg, rather than setting the src later - or expect weirdness
                    
                    // TODO: Possible change: don't accept url as bodyContents arg. Instead include src in options attribute. bodyContents and headContents are still optional in such a case - when those args are present, and the src attribute is html from a trusted domain, then the args will be used to append to the iframe document on load.
                    if (isUrl(args.bodyContents)){
                        options.src = args.bodyContents;
                        
                        // IE6 repaint - required a) for external iframes that are added to the doc while they are hidden, and b) for some external iframes that are moved in the DOM (e.g. google.co.uk)
                        if (externalIframesInvisibleOnAppend){
                            this.ready(this.repaint);
                        }
                    }   
                    // If an injected iframe (i.e. without a document url set as the src)
                    else {
                        this
                            // When an iframe element is attached to the AOMI object, bind a handler function to the iframe's native 'load' event
                            .bind('attachElement', function(){
                                this._iframeLoad(function(){
                                    var handler = arguments.callee;
                                    
                                    // If the iframe has properly loaded
                                    if (aomi._okToLoad()){
                                        aomi
                                            // Unbind this handler
                                            ._iframeLoad(handler, true)
                                            
                                            // Write out the new document
                                            .document(true)
                                            
                                            // Bind an AOMI 'load' handler to the native 'load' event
                                            // NOTE: We do this after the document is written, because browsers differ in whether they trigger an iframe load event after the doc is written. So, we manually trigger the event for all browsers.
                                            ._iframeLoad(function(){
                                                aomi.trigger('load');
                                            });                                        
                                    }
                                    else if (documentDestroyedOnIframeMove){
                                        aomi.reload();
                                    }
                                    // In IE, just replace the iframe element, as a reload would be unable to restore() the contents
                                    else {
                                        aomi.replace();
                                    }
                                });
                            });
                        
                        // Auto-resize behaviour
                        if (autowidth || autoheight){
                            if (autowidth){
                                options.css.width = 'auto';
                            }
                                                    
                            // When iframe first added to the DOM, resize it, and set up event listeners to resize later
                            this
                                .one('attachElement', function(){
                                    firstResize = true;
                                    this.css('visibility', 'hidden'); // hide iframe until it is resized
                                })
                            
                                .one('ready', function(){
                                    // Throttle the interval between iframe resize actions, and that between responses to the global window's 'resize' event
                                    var resize, pollForVisibility;
                                    
                                    resize = $.throttle(function(){
                                        aomi.resize(autowidth, autoheight);
                                        
                                        if (firstResize){
                                            firstResize = false;
                                            aomi.css('visibility', 'visible'); // show iframe again
                                        }
                                    }, options.resizeThrottle, true);
                                    
                                    // iframe container is not yet displayed. If the container has display:none (e.g. it's in a non-selected tab), then resize() can't determine the height of the body contents, and the iframe will have a height set to zero. So, we poll for the iframe container to be displayed. Hack!
                                    // TODO: Does it matter that we stop polling once we're visible the first time? Are there practical situations where the body contents will be manipulated while the container is not displayed? Is that really our problem?
                                    if (!this.is(':visible')){
                                        pollForVisibility = win.setInterval(function(){
                                            if (aomi.parent().is(':visible')){ // re-check parent in case iframe is moved in DOM?
                                                resize();
                                                win.clearInterval(pollForVisibility);
                                            }
                                        }, 1000);
                                    }
                                    
                                    // Bind for later
                                    this
                                        .bind('manipulateHead', function(){ // TODO: For some reason (presumably related to the bind method), we need to pass this anonymous function, and not simply .bind('manipulateHead', resize) - else the callback won't fire
                                            return resize();
                                        })
                                        .bind('manipulateBody', function(){
                                            return resize();
                                        })
                                        .load(function(){ // NOTE: We resize on 'ready', so that the dimensions are in place for any custom 'ready' callbacks, and then on 'load', after any custom ready callbacks
                                            return resize();
                                        });
                                    
                                    // If we're not matching the iframe element's width to that of the iframe body's contents (instead we're letting the element stretch to fill its parent node, via css width:100%)
                                    if (!autowidth){
                                        // respond to browser window resizing
                                        $(win).resize(resize);
                                    }                                    
                                    // TODO: Is it worth resizing the iframe whenever any of its contents is manipulated, e.g. by listening to DOM mutation events from within the document?
                                });
                        }
                        
                        // Setup iframe document caching
                        // Ridiculously, each time the iframe element is moved, or removed and re-inserted into the DOM, then the native onload event fires and the iframe's document is discarded. (This doesn't happen in IE, thought). So we need to bring back the contents from the discarded document, by caching it and restoring from the cache on each 'load' event.
                        if (documentDestroyedOnIframeMove){
                            this
                                // Track when an 'extreme' reload takes place
                                .bind('extremereloadstart', function(){
                                    fromReload = true;
                                })
                                .load(function(ev){
                                    // If an extreme reload, then don't restore from cached nodes - a) because the original constructor args are used, b) because probably the browser doesn't support adoptNode, etc, so we'll end up reloading again anyway during cache(), leading to an infinite loop          
                                    if (fromReload){
                                        fromReload = false;
                                    }
                                    // Restore from cached nodes. Not restored if the body already has contents.
                                    // TODO: Could it be problematic to not restore when there is already body contents? Should we check if there's head contents too?
                                    else if (!this.body().children().length){
                                        this.restore();
                                    }
                                    this.cache();
                                });
                        }
                    }
                    
                    return this
                        // Attach the iframe element
                        ._attachElement()
                        
                        // Init complete
                        .trigger('init');
                },
            
                $: function(arg){
                    var doc = this.document();
                    return arg ? $(arg, doc[0]) : doc;
                },
                
                
                // doctype() examples:
                    // this.doctype(5);
                    // this.doctype(4.01, 'strict');
                    // this.doctype() // returns doctype object
                doctype: function(v){
                    var doctype;
                                    
                    if (v){
                        this.options().doctype = v;
                        return this;
                    }
                    v = this.options().doctype;
                    doctype = '<!DOCTYPE ';
                    if (v === 5){ // html5 doctype
                        doctype += 'html';
                    }
                    else if (v === 4.01){
                        doctype += 'HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"';
                    }
                    return doctype + '>';
                },
                
                // NOTE: We use $.event.trigger() instead of this.trigger(), because we want the callback to have the AOMI object as the 'this' keyword, rather than the iframe element itself
                trigger: function(type, data){
                    // DEBUG LOGGING
                    if ($.iframe.debug){
                        var debug = [this.attr('id') + ': *' + type + '*'];
                        if (typeof data !== 'undefined'){
                            debug.push(data);
                        }
                        //debug.push(arguments.callee.caller);
                        $.iframe.debug.apply(null, debug);
                    }
                    // end DEBUG LOGGING
                    
                    event.trigger(type + '.' + ns, data, this);
                    return this;
                },
                                
                bind: function(type, callback){
                    event.add(this, type + '.' + ns, callback);
                    return this;
                },
                
                unbind: function(type, callback){
                    event.remove(this, type + '.' + ns, callback);
                    return this;
                },
                
                one: function(type, callback){
                    return this.bind(type, function outerCallback(){
                        callback.apply(this, $.makeArray(arguments));
                        this.unbind(type, outerCallback);
                    });
                },
                
                
                // Avoid jQuery 1.4.2 bug, where it assumes that events are always bound to DOM nodes
                addEventListener: function(){},
                removeEventListener:function(){},
                
                
                /*
                Ideas / Examples:
                aomi.history(-1);
                
                aomi.init(fn); // a function to do everything needed to initialise the widget; should be able to be re-run again at any time, to re-initialise the widget
                aomi.load(0); // index number for screen history - e.g. url # fragments
                aomi.load(fn); // bind callback for future 'load' events
                => aomi.document(head, body); // etc
                
                $.iframe.doctypes = {
                    html5: '<!DOCTYPE html>'
                };
                
                aomi.doctype('html5') === $.iframe.doctypes['html5'];
                */
                
                // TODO: Should the iframe have visibility:hidden at first, then show it on load? - this may make the appearance and first rendering smoother
                document: function(){
                    var
                        args = $.makeArray(arguments),
                        doc;
                    
                    try {
                        doc = this.window().attr('document');
                    }
                    catch(e){}
                    
                    if (!args.length){
                        return $(doc || []);
                    }
                    // Cache the passed arguments
                    if (args[0] !== true){
                        this._args(args);
                    }
                    
                    // Doc is ready for manipulation
                    if (doc){
                        doc.open();
                        doc.write(
                            this.doctype() + '\n' +
                            '<head></head><body></body>'                    
                        );
                        doc.close();
                        this
                            ._trim()
                            // Apply the cached options & args
                            ._args(true)
                            // Trigger the 'ready' event, which is analogous to the $().ready() event for the global document
                            .trigger('ready')
                            .trigger('load');
                    }
                    // Doc not ready, so apply arguments at next load event
                    else {
                        this.one('load', function(){
                            this.document(true);
                        });
                    }
                    return this;
                },
                
                _args: function(){
                    var
                        aomi = this,
                        args = $.makeArray(arguments),
                        defaultArgs = {
                            headContents: '',
                            bodyContents: '',
                            callback: function(){}
                            // NOTE: options arg is handled by aomi.options()
                        },
                        argsCache = this._argsCache || defaultArgs,
                        found = {},
                        optionsFound;
                    
                    // Return cached args
                    if (!args.length){
                        return $.extend(true, argsCache, {
                            options:this.options()
                        });
                    }
                    
                    // An array of args was passed. Re-apply as arguments to this function.
                    if ($.isArray(args[0])){
                        return this._args.apply(this, args[0]);
                    }
                    if (args[0] === true){
                        // apply cached options and constructor arguments
                        this
                            .options(true)
                            // TODO: This will empty the head, overwriting the title option set on the previous line. Can the two lines be swapped?
                            // TODO: Do we need to call head() if headContents is blank? Should we empty the head, if there is no headContents?
                            .head(argsCache.headContents, true)
                            .body(argsCache.bodyContents, true)
                            // Call the callback on the next 'ready' event
                            .one('ready', argsCache.callback);
                    }
                    else {                    
                        // All arguments are optional. Determine which were supplied.
                        $.each(args.reverse(), function(i, arg){
                            if (!found.callback && $.isFunction(arg)){
                                found.callback = arg;
                            }
                            else if (!optionsFound && typeof arg === 'object' && !isJQuery(arg) && !isElement(arg)){
                                aomi.options(arg);
                                optionsFound = true;
                            }
                            // TODO: If the bodyContents or headContents is a DOM node or jQuery collection, does this throw an error in some browsers? Probably, since we have not used adoptNode, and the nodes have a different ownerDocument. Should the logic in reload for falling back from adoptNode be taken into a more generic function that is used here?
                            else if (!found.bodyContents && typeof arg !== 'undefined'){
                                found.bodyContents = arg;
                            }
                            // Once callback and options are assigned, any remaining args must be the headContents; then exit loop
                            else if (!found.headContents && typeof arg !== 'undefined'){
                                found.headContents = arg;
                            }
                        });
                        this._argsCache = $.extend(true, defaultArgs, found);
                    }
                    return this;
                },
                
                options: $.extend(
                    function(newOptions){
                        var
                            thisFn = this.options,
                            getDefaults = thisFn.defaultOptions,
                            options;
                        
                        if (newOptions){
                            // Cache new options
                            if (typeof newOptions === 'object'){
                                this._options = $.extend(true, getDefaults(), newOptions);
                            }
                            // Apply cached options to iframe
                            else if (newOptions === true){
                                options = this.options();
                                this
                                    // Re-apply cached title
                                    .title(true)
                                    
                                    // Let anchor links open pages in the default target
                                    .ready(function(){
                                        this.$('a').live('click', function(){
                                            if (!$(this).attr('target') && $(this).attr('href')){
                                                $(this).attr('target', options.target);
                                            }
                                        });
                                    });
                            }
                            return this;
                        }
                                                
                        // No args passed
                        if (!this._options){
                            this._options = getDefaults();
                        }
                        return this._options;
                    },
                    {
                        defaultOptions: function(){
                            return $.extend(true, {}, defaultOptions);
                        }
                    }
                ),                
                
                load: function(callback){
                    return this.bind('load', callback);
                },
                
                ready: function(callback){
                    return this.bind('ready', callback);
                },
                
                reload: function(extreme){
                    // 'soft reload': re-apply src attribute
                    // NOTE: documentDestroyedOnIframeMove is included here, as only those browsers will have a 'soft' reload trigger the restore() method. Other browsers (that is, IE), should instead perform a hard reload
                    if ((!extreme && documentDestroyedOnIframeMove) || !this.hasBlankSrc()){
                        this.attr('src', this.attr('src'));
                    }
                    // 'hard reload': re-apply original constructor args
                    else {     
                        this.trigger('extremereloadstart');
                        this.document(true);
                    }
                    return this.trigger('reload', !!extreme);
                },
                
                // Duplicate this AOMI object. This will essentially clone the iframe element, its document and all its settings, provided that they have only been manipulated via the AOMI API - e.g. by passing a function to the original constructor
                // TODO: should _args() be able to return as an array, so we can do an apply() on $.iframe?
                // TODO: Should this attempt to clone the current AOMI document's head and body elements?
                clone: function(){
                    var args = this._args();
                    return $.iframe(args.headContents, args.bodyContents, this.options(), args.callback);
                },
                
                // Replace the iframe element with the iframe element from a replica AOMI object
                replace: function(){
                    var newIframe = this.clone();
                    
                    this.replaceWith(newIframe);
                    this[0] = newIframe[0];
                    return this.trigger('replace');
                },
                
                // Trigger a repaint of the iframe - e.g. for external iframes in IE6, where the contents aren't always shown at first
                repaint: function(){
                    var className = ns + '-repaint';
                    this
                        .addClass(className)
                        .removeClass(className);
                    return this.trigger('repaint');
                },
            
                window: function(){
                    var win = this._windowObj();
                    if (win){ // For an injected iframe not yet in the DOM, then win is null
                        try { // For an external iframe, win is accessible, but $(win) will throw a permission denied error
                            return $(win);
                        }
                        catch(e){}
                    }
                    return $([]);
                },
                
                // TODO: Make this a read-write method
                location: function(){
                    var
                        win = this.window(),
                        loc = win.attr('location');
                        
                    if (loc){
                        try {
                            return loc.href; // location href is available, so iframe is in the DOM and is in the same domain
                        }
                        catch(e){}
                    }
                    return this._windowObj() ?
                        null : // iframe is in the DOM, but has a cross-domain document
                        this.attr('src'); // iframe is out of the DOM, so its window doesn't exist and it has no location
                },

                head: function(contents, emptyFirst){
                    var
                        head = this.$('head'),
                        method = 'append';
                    
                    if (typeof contents !== 'undefined' && contents !== false){
                        if (head.length){
                            if (emptyFirst){
                                head.empty();
                            }
                            if (contents){
                                head[method](contents);
                            }
                            this.trigger('manipulateHead', method);
                        }
                        // Document not active because iframe out of the DOM. Defer till the next 'load' event.
                        else {
                            this.one('load', function(){
                                this.head(contents, emptyFirst);
                            });
                        }
                        return this;
                    }
                    return head;
                },
                
                body: function(contents, emptyFirst){
                    var body = this.$('body');
                    if (typeof contents !== 'undefined' && contents !== false){
                        if (body.length){ // TODO: Perhaps this should also check if the 'ready' event has ever fired - e.g. in situations where iframe has just been added to the DOM, but has not yet loaded
                            if (emptyFirst){
                                this.empty();
                            }
                            if (contents){
                                this.append(contents);
                            }
                        }
                        // Document not active because iframe out of the DOM. Defer till the next 'load' event.
                        else {
                            this.one('load', function(){
                                this.body(contents, emptyFirst);
                            });
                        }
                        return this;
                    }
                    return body;
                },
                
                title: function(title){
                    if (title === true){
                        return this.title(this.options().title);
                    }
                    if (typeof title !== 'undefined'){
                        this.options().title = title;
                        this.$().attr('title', title);
                        return this;
                    }
                    return this.$().attr('title');
                },
                
                style: function(cssText){
                    return this.head('<style>' + cssText + '</style>');
                },
            
                // TODO: If bodyChildren is a block-level element (e.g. a div) then, unless specific css has been applied, its width will stretch to fill the body element which, by default, is a set size in iframe documents (e.g. 300px wide in Firefox 3.5). Is there a way to determine the width of the body contents, as they would be on their own? E.g. by temporarily setting the direct children to have display:inline (which feels hacky, but might just work).
                
                // NOTE: If the iframe element's parent node has position:absolute, then the options.css.width = '100%' won't succeed in having the iframe the same width as its parent. Instead, resize(true) will need to be called.
                resize: function(doWidth, doHeight){ // default is resize height only (as with other block-level elements)
                    var body, /*htmlDims,*/ bodyDims, childrenDims, width, height;
                    
                    doWidth = doWidth || false;
                    doHeight = doHeight !== false || true;
                
                    function getDimensions(selector){
                        var maxWidth = 0, totalHeight = 0;
                        
                        $(selector).each(function(){
                            var width;
                            
                            if (doWidth){
                                width = $(this).outerWidth(true);
                                if (width > maxWidth){
                                    maxWidth = width;
                                }
                            }
                            if (doHeight){
                                totalHeight += $(this).outerHeight(true);
                            }
                        });
                        return [maxWidth, totalHeight];
                    }
                    
                    body = this.body();
                    //htmlDims = getDimensions(this.$('html'));
                    bodyDims = getDimensions(body);
                    childrenDims = getDimensions(body.children());
                    
                    if (doWidth){
                        width = Math.max(bodyDims[0], childrenDims[0]);
                        this.width(width);
                    }
                    if (doHeight){
                        height = Math.max(bodyDims[1], childrenDims[1]);
                        this.height(height);
                    }
                    return this.trigger('resize', [width, height]);
                },
                
                // TODO: Currently, this will return true for an iframe that has a cross-domain src attribute and is not yet in the DOM. We should include a check to compare the domain of the host window with the domain of the iframe window - including checking document.domain property
                isSameDomain: function(){
                    return this.location() !== null;
                },
                
                hasExternalDocument: function(){
                    var loc = this.location();
                    return loc === null || (loc !== 'about:blank' && loc !== win.location.href);
                    // NOTE: the comparison with the host window href is because, in WebKit, an injected iframe may have a location set to that url. This would also match an iframe that has a src matching the host document url, though this seems unlikely to take place in practice.
                    // NOTE: this also returns true when the iframe src attribute is for an external document, but the iframe is out of the DOM and so doesn't actually contain a document at that time
                },
                
                hasBlankSrc: function(){
                    var src = this.attr('src');
                    return !src || src === 'about:blank';
                },
                
                cache: function(){                
                    // iframe is not in the DOM
                    if (!this.$()[0]){
                        return this;
                    }
                    
                    // Update the cached nodes
                    this._cachedNodes = this.head().add(this.body());
                    this.trigger('cache');
                    return this;
                },
                
                // TODO: It may be necessary to restore any possible cached events on the document and htmlElement, e.g. via .data('events') property
                // TODO: This needs to restore the originally set doctype. Currently, it won't do so, except when the append methods fail, and the reload() method is called (e.g. Opera 10.10). The function needs to re-write the document from scratch, but without disturbing any load() callbacks. Perhaps we need a stealth load - temporary turning off and turning on of the load event listener. It's fortunate that IE does not generally need to be restored when the iframe is moved in the DOM, because the loss of the doctype would be most obvious there, due to the Quirks mode box model.
                restore: function(){
                    // Methods to try, in order. If all fail, then the iframe will re-initialize.
                    var
                        methodsToTry = ['adoptNode', 'appendChild', 'importNode', 'cloneNode'],
                        appendMethod = $.iframe.appendMethod,
                        htmlElement = this.$('html').empty(),
                        doc = this.$()[0],
                        cachedNodes = this._cachedNodes;
                        
                    if (!doc || !cachedNodes){
                        return this;
                    }
                    
                    // If we don't yet know the append method to use, then cycle through the different options. This only needs to be determined the first time an iframe is moved in the DOM, and only once per page view.
                    if (!appendMethod){
                        appendMethod = this._findAppendMethod(doc, methodsToTry, htmlElement, cachedNodes) || 'reload';
                        $.iframe.appendMethod = appendMethod;
                    }
                    // If we've already determined the method to use, then use it
                    else if (appendMethod !== 'reload'){
                        this._appendWith(doc, appendMethod, htmlElement, cachedNodes);
                    }
                    // If the standard append methods don't work, then reload the iframe, using the original constructor arguments.
                    if (appendMethod === 'reload'){
                        // Remove the cached nodes, to prevent the reload triggering a new 'load' event => call to cache() => infinite loop
                        this._cachedNodes = null; // NOTE: In Opera 10.10, if we 'delete' the _cachedNodes property, weird stuff happens, so best to make null
                        this.reload(true);
                    }
                    // Re-apply the document title
                    // NOTE: We shouldn't need to re-apply any of the other options, such as CSS on the iframe element
                    else {
                        this.title(true);
                        
                        // TODO: TEMP HACK: why is this suddenly needed? The problem: in FF3.5 and WebKit, when the iframe element is moved in the DOM, the margin around the body contents is somehow not rendered as it should be. Not sure if there are problems with other CSS props.
                        this.body().contents().each(function(){
                            var el = $(this);
                            el.css('margin', el.css('marginTop') + ' ' + el.css('marginRight') + ' ' + el.css('marginBottom') + ' ' + el.css('marginLeft'));
                        });
                    }
                    
                    return this.trigger('restore', appendMethod);
                },
                
                // Advised not to use this API method externally
                // Proxy for iframe's native load event, with free jQuery event handling
                _iframeLoad: function(callback, unbind){
                    var aomi = this;
                    
                    if (!unbind){
                        $(this[0]).bind('load', callback);
                        
                        // Prevent IE having permission denied error, when relying on jQuery's built-in unload event handler removal
                        $(win).unload(function(){
                            aomi._iframeLoad(callback, true);
                        });
                    }
                    else {
                        $(this[0]).unbind('load', callback);
                    }
                    return this;
                },
                
                _attachElement: function(){
                    var options = this.options();
                    
                    // Absorb a jQuery-wrapped iframe element into the AOMI object
                    $.fn.init.call(this, '<iframe></iframe>');
                    
                    // iframe element manipulation: apply attributes and styling
                    this
                        .css(options.css)
                        .attr(options.attr)
                        .addClass(ns)
                        .attr('src', options.src);
                    
                    return this
                        // iframe document and contents: apply options
                        .options(true)
                        .trigger('attachElement');
                },
                
                _windowObj: function(){
                    try { // Can cause "unspecified error" in IE if the window's not yet ready
                        return this[0].contentWindow;
                    }
                    catch(e){
                        return false;
                    }
                },
                
                _appendWith: function(doc, method, parentNode, childNodes){
                    if ($.isFunction(doc[method])){
                        try {
                            childNodes.each(
                                function(){
                                    var newNode;
                                    switch (method){
                                        case 'cloneNode':
                                        newNode = this[method](true);
                                        break;
                                        
                                        case 'appendChild':
                                        newNode = this;
                                        break;
                                        
                                        default: // adoptNode & importNode
                                        newNode = doc[method](this, true);
                                    }
                                    parentNode.append(newNode);
                                }
                            );
                            return true;
                        }
                        catch(e){}
                    }
                    return false;
                },
                
                _findAppendMethod: function(doc, methods, parentNode, childNodes){
                    var aomi = this, appendMethod;
                    
                    $.each(methods, function(i, method){
                        if (aomi._appendWith(doc, method, parentNode, childNodes)){
                            appendMethod = method;
                            return false;
                        }
                    });
                                    
                    return appendMethod;
                },
                
                _trim: function(){
                    this.body()
                        .css(cssPlain);
                    return this;
                },
                
                _hasSrcMismatch: function(){
                    return (this.hasBlankSrc() && this.hasExternalDocument());
                },
                
                // A check to prevent the situation where an iframe with an external src is on page, as well as an injected iframe; if the iframes are moved in the DOM and the page reloaded, then the contents of the external src iframe may be duplicated into the injected iframe (seen in FF3.5 and others). This function re-appplies the 'about:blank' src attribute of injected iframes, to force a reload of its content
                _okToLoad: function(){
                    var ok = true;
                    if (this._hasSrcMismatch()){ // add other tests here, if required
                        ok = false;
                    }
                    return ok;
                }
            },
            
            // Add modified jQuery methods to the prototype
            (function(){
                var
                    jQueryMethods = [
                        {
                            // Methods to manipulate the iframe element
                            fn: [
                                'appendTo',
                                'prependTo',
                                'insertBefore',
                                'insertAfter',
                                'replaceAll'
                            ],
                            
                            wrapper: function(method){
                                return function(){
                                    $.fn[method].apply(this, arguments);
                                    // Work around browser rendering quirks
                                    if (!this.hasBlankSrc()){
                                        this.reload();
                                    }
                                    return this.trigger('manipulateIframe', method);
                                };
                            }
                        },
                        
                        {
                            // Methods to manipulate the iframe's body contents
                            fn: [
                                'append',
                                'prepend',
                                'html',
                                'text',
                                'wrapInner',
                                'empty'
                            ],
                            
                            wrapper: function(method){
                                return function(){
                                    $.fn[method].apply(this.body(), arguments);
                                    return this.trigger('manipulateBody', method);
                                };
                            }
                        }
                    ],
                    methodsForPrototype = {};
                
                $.each(
                    jQueryMethods,
                    function(i, method){
                        var wrapper = method.wrapper;
                        $.each(
                            method.fn,
                            function(j, fn){
                                methodsForPrototype[fn] = wrapper(fn);
                            }
                        );
                    }
                );
                return methodsForPrototype;
            }())
        ));
        
    
    // Extend jQuery with jQuery.iframe() and jQuery(elem).intoIframe()
    $.extend(
        true,
        {
            iframe: $.extend(
                function(headContents, bodyContents, options, callback){
                    return new AppleOfMyIframe(headContents, bodyContents, options, callback);
                },
                {aomi: version} // script version number - for 3rd party scripts to verify that jQuery.iframe is created by AppleOfMyIframe, and to check the script version
            ),
            fn: {
                // TODO: Allow multiple elements in a collection to be replaced with iframes, e.g. $('.toReplace').intoIframe()
                // TODO: Where the element doesn't have an explicit width set, the iframe will not be able to resize to it. One hacky method to determine the width: display the element inline, measure its width, then return the display and then set the width of the iframe.
                intoIframe: function(headContents, options, callback){
                    return $.iframe(headContents, this, options, callback)
                        .replaceAll(this);
                }
            }
        }
    );
    
    // Expose AOMI prototype to $.iframe.fn
    $.iframe.fn = AppleOfMyIframe.prototype;
    
}(jQuery));

// **

/*!
* Nitelite
*   github.com/premasagar/nitelite
*
*//*
    A stipped-down lightbox plugin for jQuery

    by Premasagar Rose
        dharmafly.com

    license
        opensource.org/licenses/mit-license.php

    **

    creates method
        jQuery.nitelite()
        
    **
    
    reverence
        last.fm/music/The+Nite-Liters
        
*/


(function($){
    var
        namespace = 'nitelite',
        version = '0.1.1',
       
        win = window,
        document = win.document,
        
        settings = {
            overlay: {
                opacity: 0.7,
                bgColor: '#000'
            }
        },
        
        ns = function ns(props, delimiter){
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
        },
    
        notifyGlobalWindow = function(origin, eventTypes, namespace){ // origin is originating object (e.g. Overlay instance), eventTypes is array (e.g. ['add', 'remove']), namespace is optional - if not provided, the origin must have a 'type' property (e.g. 'overlay')
            $.each(eventTypes, function(i, type){
                try {
                    $(origin)
                        .bind(type, function(){
                            $(win).trigger(ns(), {type: (namespace || origin.type) + '.' + type, origin:this});
                        });
                }
                catch(e){}
            });
            return origin;
        },
        
        // Find all visible object and embed elements that are not children of other visible object or embed elements
        hideFlash = function(){
            if (!hideFlash.hidden){
                hideFlash.hidden = [];
            }
            $('object:visible, embed:visible')
                .filter(function(){
                    return !$(this).parents('embed:visible, object:visible').length;
                })
                .each(function(){
                    var o = $(this);
                    hideFlash.hidden.push([
                        o, o.css('visibility')
                    ]);
                    o.css('visibility', 'hidden');
                });
        },
        
        // Return objects and embeds to original visibility value
        showFlash = function(){
            $.each(hideFlash.hidden, function(i, o){
                o[0].css('visibility', o[1]);
            });
            hideFlash.hidden = [];
        },
        
        Nitelite = {
            // TODO: Could use an iframe for overlay, to prevent small chance of CSS bleed
            Overlay: $.extend(
                function(opacity, bgColor){                                
                    if (opacity){ // TODO: This doesn't allow opacity=0. Perhaps we should check typeof==='number'||typeof==='string'
                        this.opacity = opacity;
                    }
                    if (bgColor){
                        this.bgColor = bgColor;
                    }
                },
                {
                    prototype: {
                        type: 'overlay',
                        opacity: settings.overlay.opacity, // TODO: This should use *instance* settings, not global settings
                        bgColor: settings.overlay.bgColor, // TODO: as above
            
                        fillScreen: function(){
                            this.node
                                // match document dimensions
                                .width($(document).width() + 'px')
                                .height($(document).height() + 'px');
                            return this;
                        },
                        
                        create: function(){
                            var overlay = this;
                            this.node = $('<div></div>')
                                .addClass(ns() + ' ' + ns('overlay'))
                                .css({ // TODO: Should this be moved to a <style> element in the <head>, along with other CSS? (except opacity and bgColor, if different from default)
                                    opacity:this.opacity,
                                    position:'absolute',
                                    top:0,
                                    left:0,
                                    margin:0,
                                    padding:0,
                                    'background-color':this.bgColor, // TODO: this previously used the property backgroundColor, but this showed problems when shown on a page with the bbcwswidget - to be investigated
                                    border:'0 none ' + this.bgColor,
                                    'z-index':99999
                                });
                            this.fillScreen();
                            
                            $(win).unload(function(){
                                overlay.unload();
                            });
                            $(this).triggerHandler('create');
                            return this;
                        },
                        
                        add: function(callback){
                            var overlay = this;
                            
                            if (callback){
                                $(overlay).one('add', callback);
                                return this.add();
                            }
                            
                            if (!this.node){
                                this.create();
                            }
                            
                            this.node
                                .hide()
                                .data(ns(), this) /* add the Overlay object as the value of the 'sqwidget' data property - NOTE: the data is attached to the add() method and added every time the overlay is inserted into the DOM, rather than being attached to the create() method, because jQuery automatically destroys data on removal from the DOM TODO: probably the actual Sqwidget instance object should go here */
                                .appendTo('body')
                                .fadeIn(function(){
                                    $(overlay).triggerHandler('add');
                                });
                            return this;
                        },
                        
                        remove: function(){
                            var
                                overlay = this,
                                node = this.node;
                            
                            if (node){
                                node.fadeOut(function(){
                                    $(this).remove();
                                    $(overlay).triggerHandler('remove');
                                });
                            }
                            return this;
                        },
                        
                        unload: function(){
                            this.remove();
                            delete this.node;
                            // try/catch added due to bug in jQuery 1.4.2
                            try {
                                $(this).triggerHandler('unload');
                            }
                            catch(e){}
                            return this;
                        }
                    }
                }
            ),

            Lightbox: $.extend(
                function(){
                    var
                        lb = this,
                        centerHandler = $.throttle(
                            function(){
                                lb.center();
                                lb.overlay.fillScreen();
                            }, 250, true
                        ),
                        // track click of 'Esc' key - TODO not functioning
                        escKeyHandler = function(ev){
                            if (ev.which === 27){ // ESC key
                                lb.close();
                            }
                        };
        
                    $.extend(
                        this,
                        {
                            overlay: $.extend(
                                new Nitelite.Overlay(), // or $.nitelite.overlay()
                                {lightbox:this}
                            )
                        }
                    );
        
                    // Add handler to close the lightbox when the overlay is clicked
                    // We bind one('click') to every overlay.add(). We can't bind click() on overlay.create(), because jQuery automatically removes the click handler when the node is removed from the DOM and so, it wouldn't remain the next time the overlay is added back to the DOM
                    $(this.overlay)
                        .bind('add', function(){
                            this.node
                                .one('click', function(){
                                    lb.close();
                                });
                        });
                        
                    $(this)
                        .bind('open', function(){
                            $(win).resize(centerHandler);
                            
                            // 'Esc' key trapping
                            $(document).keydown(escKeyHandler);
                            win.setTimeout(function(){
                                $('iframe').each(
                                    function(){
                                        try {
                                            $(this.contentWindow.document)
                                                .keydown(escKeyHandler);
                                        }
                                        catch(e){}
                                    }
                                );
                            }, 260); // leave enough time for iframes in container to initialise
                        })
                        .bind('close', function(){
                            $(win).unbind('resize', centerHandler);
                            
                            // Unbind 'Esc' key trapping
                            $(document).unbind('keydown', escKeyHandler);
                            $('iframe').each(
                                function(){
                                    try {
                                        $(this.contentWindow.document)
                                            .unbind('keydown', escKeyHandler);
                                    }
                                    catch(e){}
                                }
                            );
                        });
                },
                {
                    prototype: {
                        type: 'lightbox',
                        
                        center: function(){
                            var
                                container = this.container,
                                lbLeft, lbTop;
                                
                            if (container){
                                lbLeft = Math.floor(($(win).width() - container.width()) / 2) + $(document).scrollLeft();
                                    lbTop = Math.floor(($(win).height() - container.height()) / 2) + $(document).scrollTop();
                                    if (lbLeft < 0){
                                        lbLeft = 0;
                                    }
                                    if (lbTop < 0){
                                        lbTop = 0;
                                    }
                                    container  
                                        .css({
                                            left: lbLeft + 'px',
                                            top: lbTop + 'px'
                                        });
                            }
                            return this;
                        },
                        
                        open: function(contents){
                            var lb = this;
                            hideFlash();
                            
                            this.overlay.add();
                            if (!lb.container){
                                lb.container = $('<div></div>')
                                    .hide()
                                    .addClass(ns() + ' ' + ns([lb.type, 'container']))
                                    .css({ // TODO: Should this be moved to a <style> element in the <head>, along with other CSS?
                                        position:'absolute',
                                        margin:0,
                                        padding:0,
                                        'z-index':99999
                                        //,position:'fixed' // TODO: only do this if the contents fits within the window viewport, and what about scrolling the background contents? and IE6?
                                    });
                                $(win).unload(function(){
                                    lb.unload();
                                });
                            }
                            lb.container
                                .append(contents)
                                .appendTo('body');
                            lb
                                .center() // TODO: Is this necessary?
                                .container.show();
                            lb.overlay.fillScreen();
                            
                            // track click of 'Esc' key
                            $(document).bind('keydown', function bindEsc(ev){
                                if (ev.which === 27){ // ESC key
                                    $(this).unbind('keydown', bindEsc);
                                    lb.close();
                                }
                            });
                            
                            $(lb).triggerHandler('open'); // TODO: The 'open' and 'close' events will fire before the overlay has finished fading in. Is that OK? Should triggerHandler() be called before overlay.add(); Is it better to have an 'openstart' and 'open' event, plus 'closestart' and 'close'?
                            lb.center();
                            return this;
                        },
                        
                        close: function(handler, eventType){
                            var lb = this;
                            showFlash();
                            
                            // Assign a handler element (some kind of jQuery collection) to trigger.close()
                            if (typeof handler === 'object'){
                                handler.bind(eventType || 'click', function(){
                                    lb.close();
                                });
                            }
                            else {
                                this.overlay.remove();
                                this.container
                                    .empty()
                                    .remove();
                                $(this).triggerHandler('close');
                            }
                            return this;
                        },
                        
                        unload: function(){
                            this.close();
                            delete this.container;
                            // try/catch added due to bug in jQuery 1.4.2
                            try {
                                $(this).triggerHandler('unload');
                            }
                            catch(e){}
                            return this;
                        }
                    }
                }
            )
        },
        
        // API
        api = $.extend(
            function(){
                var lb = new Nitelite.Lightbox();
                // Notify global window of internal events
                // This 'firehose' of Sqwidget events would allow innovation and loosely coupled plugins
                return notifyGlobalWindow(lb, ['open', 'close', 'remove', 'unload']);
            },
            {
                nitelite: version,
            
                overlay: function(){
                   var ov = new Nitelite.Overlay();
                   return notifyGlobalWindow(ov, ['create', 'add', 'remove', 'unload']);
                }
            }
        );
    
    // Assign jQuery.nitelite
    $.nitelite = api;
    
}(jQuery));

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
            function(data, callback){
                Sqwidget.widgets.push(this);
                
                if (typeof data === 'object'){
                    $.extend(this, data, {uid:Sqwidget.uid()});
                }
                if (typeof callback === 'function'){
                    callback.call(this, $);
                }
            },
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
                        
                        // Setter: Add a query string parameter to a url. E.g. addUrlParam('http://example.com?v=1', 'this', 'that');
                        // TODO: Getter: if no value supplied, then get param value
                        urlParam: function(url, param, value){
                            return url + (!/\?/.test(url) ? '?' : '&') + param + '=' + value;
                        },
                        
                        // Return a fixed number (which may be considered arbitrary) when passed an interval of time (in days; may be decimal part of day, e.g. 1/24 for 1 hour)
                        // Useful for breaking server caching of resources after a specified interval of time. E.g. "http://example.com/data.js?cache=" + timeChunk(30);
                        timeChunk: function(intervalDays){
                            var decimalPlaces, baseline, msInADay, interval, now, chunk;
                            decimalPlaces = 4; // Allows accuracy to nearest minute
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
    
    function Template(sqwidget, templateName) {  
        var sqwidget = sqwidget;
        var templateName = templateName;
        /** set of widgets (instances on the page) for this template */
        var widgets = [];
        var templates = {};
        var scripts = [];
        var templateText = '';
        var loaded = false;


        function loadTemplate() {
            _('template name is ' + templateName);
            jQuery.get(templateName, function(data, textStatus, request) {
                // on template loaded
                _('template data: ' + data);
                _('template loaded');
                //TODO error detection here?
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
                setDefaultTemplates();
            });
        }       
        
        function parseTemplateFile(template) {
            _('parsing template file for ' + templateName);
            // TODO document type detection (doctype tells us it is )
            // assume html for now
            
            // default body html stored -- and activated immediately
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
            bodystr = template.match(/<body>([\w\W]*)<\/body>([\w\W]*?)$/);
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
            // grab javascripts from head an execute in order
            //
            j.filter('script[type!=text/template]')
             .each(function(i, t){
                t = jQuery(t);
                templates[t.attr('id')] = jQuery.trim(t.html());
            });
            
            
            
        }
        
        function setDefaultTemplates() {
            for (w in widgets) {
                widgets[w].render(templates['default']);
            }
        }
        
        
        // PUBLIC methods   
        /**
         * Register this widget with this template
         *
         */
          this.register = function(widget) {
            widgets.push(widget);
        }

        // Load the template now
        loadTemplate();
    };
    
    /**
     * SqwidgetWidget is the actual widget, which has an element to 
     * be displayed in and has private settings and is linked to a template
     * @param sqwidgetTemplate ref to the template for this wiget
     * @param div ref to DOM element (TODO what object is passed in here)
     * TODO make Widget and Template
     */
    function Widget(sqwidget, type, div, dataSqwidget, dataSqwidgetSettings) {
        var
            sqwidget = sqwidget,
            widgetType = type,
            container = div
            dataSqwidget = dataSqwidget,
            settings = dataSqwidgetSettings;
        
        
        /**
         * Get this widget up and running
         */
        this.init = function() {
            //attach ourselves to template
            var sqTemplate = sqwidget.getTemplate(dataSqwidget.template);
            sqTemplate.register(this);
            
            
            // run scripts on template in context of this widget

        };
        
        
        
        // TODO put somewhere generically useful
        function props(a) {
            var r = [];
            for (key in a) {
                r.push(key + ': "' + a[key] + '"');
            }
            return '{' + r.join(' ') + '}';
        }
        
        // PUBLIC METHODS
        
        /**
         * Render html into this widget
         * @param {String} inner html to be rendered into the div for this widget
         * TODO: cache, keep existing content to pop out etc
         */ 
        this.render = function(html) {
            //TODO pass through template rendering pipeline
            jQuery(container).html(html);
        };
        
        /**
         * eval script in the context of this object
         * TODO parse things a little bit here, and provide some eval context (with...)
         * TODO execute in own context by making a separate scope here off global
         * @param {String} string of script to eval. Should be text/javascript
         * @return {undefined}
         */
        this.evalScript = function(evalScript) {
            eval(evalScript.toString());
        }
        
        
        /**
         * toString to expose widget params
         * @return {String}
         */
         
        this.toString = function( ) {
            return 'type: ' + widgetType + ' container id: ' + div.id + ' dataSqwidget: ' + props(dataSqwidget) + ' dataSqwidgetSettings: ' + props(settings);
        };
        
        
    };
    
    // TEMP global exposure to play with classes

    window.SqwidgetTemplate = Template;
    window.SqwidgetWidget = Widget;

        

    
}());


// on DOM ready loading to be done
// TODO proper metaphors for calling this
// a default function here, but can be overridden if called by the doc?

Sqwidget.ready(function() {
    _('starting sqwidget.ready');
    
    // get widgets in the page as SqwidgetWidget objects
    var widgets = Sqwidget.widgetsInDom();
    
    _('found ' + widgets.length.toString() +' widget divs:');
    
    for (w in widgets) {
        _(' ' + widgets[w].toString());
    }
    
    
    // load templates as needed
    for (w in widgets) {
        widgets[w].init();
    }
    
});

 
 
/*jslint onevar: true, browser: true, devel: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */