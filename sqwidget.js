'use strict';

/*jslint onevar: true, browser: true, devel: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: false, strict: true, newcap: false, immed: true, nomen: false, evil: true*/


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

var Sqwidget;
  
 
// ****

/**
* SQWIDGET CORE
**/
(function () {

    // console logging placeholder function
    var 
        _ = function () {},
        sqwidgetConsole,
        splitdoc,
        ready,
        $,
        jQuery,
        window = this,
        document = window.document,
        Template,
        Widget,
        tim;
        

// **
// NATIVE JAVASCRIPT DEPENDENCIES


/////////////////////////


/*  Console logging functionality

    This block may be safely ommited. If present, it enhances sqwidget.js with console logging ability, for debugging.

    To activate console logging, add "?sqwidgetDebug" or "&sqwidgetDebug" to the URL in the browser address bar.
*/

/*!
* Console
*   github.com/premasagar/mishmash/tree/master/console/
*
*//*
    cross-browser JavaScript debug console logging

    by Premasagar Rose
        dharmafly.com

    license:
        opensource.org/licenses/mit-license.php
        
    v1.2

*/

/* This function may be safely removed, if console logging is not required for debugging */
        
    sqwidgetConsole = this.sqwidgetConsole || (function () {
        var
            window = this,
            ua = window.navigator.userAgent,
            console = window.console,
            opera = window.opera,
            debug;
    
        // Doesn't support console API
        if (!console) {
            // Opera 
            return (opera && opera.postError) ?
                function () {
                    var 
                        i, argLen, 
                        log = opera.postError, 
                        args = arguments, 
                        arg, subArgs, prop;
                    
                    log(args);
                 
                    argLen = args.length;
                    for (i = 0; i < argLen; i += 1) {
                        arg = args[i];
                        if (typeof arg === 'object' && arg !== null) {
                            subArgs = [];
                            for (prop in arg) {
                                if (arg.hasOwnProperty(prop)) {
                                    try {
                                            subArgs.push(prop + ': ' + arg[prop]);
                                        }
                                    catch (e) {}
                                }
                            }
                            log('----subArgs: ' + subArgs);
                        }
                    }
                } :
                function () {};
        }
        // Temporary for WebKit, while its console has a bug in calling debug directly or log.apply
        else if (/webkit/i.test(ua)) {      
            return function () {
                var i, argLen, args = arguments, indent = '';
                argLen = args.length;
                for (i = 0; i < argLen; i += 1) {
                    if (typeof args[i] === 'object' && JSON && JSON.stringify) {
                        try {
                            args[i] = JSON.stringify(args[i]);
                        }
                        catch (err) {
                            args[i] = '[circular reference in object, can not stringify]';
                        }
                    }
                    console.log(indent + args[i]);
                    indent = '---- ';
                }
            };
        }
        else {
            debug = console.debug;
            return debug ? // FF Firebug
                debug :
                function () {
                    var i, argLen, log = console.log, args = arguments, indent = '';
                    if (log) { // WebKit
                        if (typeof log.apply === 'function') {
                            log.apply(console, args);
                        }
                        else { // IE8
                            argLen = args.length;
                            for (i = 0; i < argLen; i += 1) {
                                log(indent + args[i]);
                                indent = '---- ';
                            }
                        }
                    }
                };
        }
    }());
/* end console logging */


    /////////////////////////


    // Determine if console logging is required
    if (this.location && this.location.search.indexOf('sqwidgetDebug') !== -1 && sqwidgetConsole) {
        this.sqwidgetDebug = true;
    }
    if (this.sqwidgetDebug) {
        _ = sqwidgetConsole;
    }


    /////////////////////////


    /*
    * getScript
    *   github.com/premasagar/mishmash/tree/master/getscript/
    *
    */
    function getScript(srcs, callback, options) {
        /**
         * Load a script into a <script> element
         * @param {String} src The source url for the script to load
         * @param {Function} callback Called when the script has loaded
         */
        function single(src, callback, options) {
            var
                charset = options.charset,
                targetWindow = options.targetWindow,
                document = targetWindow.document,
                head = document.getElementsByTagName('head')[0],
                script = document.createElement('script'),
                loaded;
            
            script.src = src;
            script.type = 'text/javascript'; // Needed for some gitchy browsers, outside of HTML5
            script.charset = charset;
            script.onload = script.onreadystatechange = function () {
                var state = this.readyState;
                if (!loaded && (!state || state === 'complete' || state === 'loaded')) {
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                    // head.removeChild(script); // Worth removing script element once loaded?
                
                    loaded = true;
                    callback.call(targetWindow);
                }
            };
            head.appendChild(script);
        }

        // **

        /**
         * Load array of scripts into script elements.  
         *
         * Note, there is only one callback function here, called after each is loaded
         *
         * @param {Array} srcs array of source files to load
         * @param {Function} callback
         */

        function multiple(srcs, callback, options) {
            var
                length = srcs.length,
                loaded = 0,
                checkIfComplete, i;
        
            // Check if all scripts have loaded
            checkIfComplete = function () {
                loaded += 1;
                if (loaded === length) {
                    callback.call(options.targetWindow);
                }
            };
        
            // Doesn't call callback until after all scripts have loaded
            for (i = 0; i < length; i += 1) {
                single(srcs[i], checkIfComplete, options);
            }
        }

        // **
    
        var
            window = this,
            method = (typeof srcs === 'string') ? single : multiple;
    
        options = options || {};
        if (!options.charset) {
            options.charset = 'utf-8';
        }
        if (!options.targetWindow) {
            options.targetWindow = window;
        }
    
        callback = callback || function () {};        
        return method.call(this, srcs, callback, options);
    }


    /////////////////////////


    /*
    * splitdoc
    *   github.com/premasagar/mishmash/tree/master/splitdoc/
    *
    */
    splitdoc = (function () {
        var exports = exports || {};
    
        function trim(str) {
            return str.replace(/^[\0\t\n\v\f\r\s]+|[\0\t\n\v\f\r\s]+$/g, ''); // match the full set of whitespace characters
        }
    
        function Splitdoc(raw, options) {
            var
                // cast raw to string
                html = typeof raw !== 'undefined' && raw !== null ? raw + '' : '',
        
                // options - most of these set the default values for components of the HTML document
                doctypeDefault = options && typeof options.doctype !== 'undefined' ? options.doctype : '<!doctype html>',
                charsetDefault = options && typeof options.charset !== 'undefined' ? options.charset : 'utf-8',
                charsetMetaDefault = options && typeof options.charsetmeta !== 'undefined' ? options.charsetmeta : '<meta charset=' + charsetDefault + '>',
                titleDefault = options && typeof options.title !== 'undefined' ? options.title : '',
                bodyDefault = options && typeof options.body !== 'undefined' ? options.body : '',
            
                // regular expressions to match supplied document
                doctypeRegex = /<!doctype html[^>]*>/i,
                htmlAttrRegex = /<html([^>]*)>/i,
                headRegex = /<head([^>]*)>([\w\W]*?)<\/head>/i, // <head> and the first available </head>, with backrefs: 1) head attributes 2) contents
                // TODO: Improve robustness of the charset regex
                charsetRegex = /<meta charset=([\w\-]+)\s*\/?>|<meta http-equiv=["']Content-Type["'] content=["']text\/html;\s*charset=([\w\-]+)["']\s*\/?>/,
                titleRegex = /<title([^>]*)>([\w\W]*?)<\/title>/i,
                bodyRegex = /<body([^>]*)>([\w\W]*?)<\/body>/i, // <body> and the first available </body>, with backrefs: 1) body attributes 2) contents
        
                // match the supplied document
                doctypeMatch = html.match(doctypeRegex),
                htmlAttrMatch = html.match(htmlAttrRegex),
                headMatch = html.match(headRegex),
                bodyMatch = html.match(bodyRegex),
            
                // grab attributes and contents of components
                // NOTE: attributes are deliberately left untrimmed
                doctype = doctypeMatch ? doctypeMatch[0] : doctypeDefault,
                htmlAttr = htmlAttrMatch ? htmlAttrMatch[1] : '',
            
                headAttr = headMatch ? headMatch[1] : '',
                headContents = headMatch ? trim(headMatch[2]) : '',
            
                charsetMatch = headContents.match(charsetRegex),
                charsetTag = charsetMatch ? trim(charsetMatch[0]) : charsetMetaDefault,
                charset = charsetMatch ? (charsetMatch[1] || charsetMatch[2]) : charsetDefault, // Is it a bad idea to have a default charset?
            
                titleMatch = headContents.match(titleRegex),
                title = trim(titleMatch ? titleMatch[2] : titleDefault),
            
                bodyAttr = bodyMatch ? bodyMatch[1] : '',
                bodyContents =  trim(
                    bodyMatch ?
                        bodyMatch[2] : // supplied body contents
                        doctypeMatch || headMatch ? // if there's already a doctype or a head section
                            bodyDefault || '' : // then bodyContents is set to default value or blank
                            html // if not, then assume the whole HTML string is to be the contents of the body
                );
        
            if (!titleMatch) {
                headContents = '<title>' + titleDefault + '</title>' + headContents;
            }
            if (!charsetMatch) {
                headContents = charsetTag + headContents;
            }
        
            // document reference object
            this.doctype = doctype;
            this.htmlAttr = htmlAttr;
        
            this.headAttr = headAttr;
            this.headContents = headContents;
        
            this.charset = charset;
            this.title = title;
        
            this.bodyAttr = bodyAttr;
            this.bodyContents = bodyContents;
        }
    
        // Prototype
        Splitdoc.prototype = {
            // construct <head> markup
            head: function () {
                return '<head' + this.headAttr + '>' + this.headContents + '</head>';
            },
            // construct <body> markup
            body: function () {
                return '<body' + this.bodyAttr + '>' + this.bodyContents + '</body>';
            },
            // construct <html> markup
            html: function () {
                return '<html' + this.htmlAttr + '>' + this.head() + this.body() + '</html>';
            },
            // construct html document source code
            // enhance the object's string representation, by overriding Object prototype's toString function
            toString: function () {
                return this.doctype + this.html();
            }
        };
    
        function splitdoc(html, options) {
            return new Splitdoc(html, options);
        }
    
        return (exports.splitdoc = splitdoc);
    }());


    /////////////////////////


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

    ready = (function () {
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
        
            if (ready) { 
                return; 
            }
            ready = true;
        
            for (var i = 0, l = readyFns.length; i < l; i += 1) {
                readyFns[i]();
            }
        
        }
    
        function scrollCheck() {
        
            if (ready) { 
                return; 
            }
        
            try {
                // http://javascript.nwbox.com/IEContentLoaded/
                docEl.doScroll("left");
            } catch (e) {
                setTimeout(scrollCheck, 1);
                return;
            }
        
            // DOM ready
            fireReady();
        
        }
    
        function DOMContentLoaded() {
        
            if (addEventListener) {
                doc.removeEventListener(dcl, DOMContentLoaded, false);
                fireReady();
            } else {
                if (attachEvent && doc.readyState === 'complete') {
                    doc.detachEvent(orsc, DOMContentLoaded);
                    fireReady();
                }
            }
        
        }
        
        function onReady(fn) {
        
            readyFns.push(fn);
        
            if (ready) { 
                return fn(); 
            }
            if (bound) { 
                return; 
            }
        
            bound = true;
        
            if (addEventListener) {
                doc.addEventListener(dcl, DOMContentLoaded, false);
                window.addEventListener('load', fireReady, false); // fallback to window.onload
            } else {
                if (attachEvent) {
                
                    // IE Event model
                
                    doc.attachEvent(orsc, DOMContentLoaded);
                    window.attachEvent('onload', fireReady); // fallback to window.onload
                
                    try {
                        atTopLevel = !window.frameElement;
                    } catch (e) {}
                
                    if (docEl.doScroll && atTopLevel) {
                        scrollCheck();
                    }
                
                }
            }
        
        }
    
        return onReady;
    
    }());


    /////////////////////////


    /*
    == tim.js ==
        A tiny JavaScript micro-templating script.
        http://gist.github.com/521352
    */
    tim = (function () {
        var starts  = "{{",
            ends    = "}}",
            path    = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
            pattern = new RegExp(starts + "(" + path + ")" + ends, "gim"),
            length  = "length",
            undef;
        
        return function (template, data) {
            return template.replace(pattern, function (tag) {
                var ref = tag.slice(starts[length], 0 - ends[length]),
                    path = ref.split("."),
                    len = path[length],
                    lookup = data,
                    i = 0;

                for (; i < len; i += 1) {
                    if (lookup === undef) {
                        break;
                    }
                    lookup = lookup[path[i]];
                    
                    if (i === len - 1) {
                        return lookup;
                    }
                }
            });
        };
    }());


    /////////////////////////



// **
// SETUP SQWIDGET

    _('started console logging in sqwidget');
    // SQWIDGET METHODS THAT ARE NOT JQUERY-DEPENDENT
    // TODO: turn Sqwidget object into a function that passes its arguments to Sqwidget.ready
    this.Sqwidget = Sqwidget = {
        version: '0.21a',            
        _: _, // console logger
        
        /** 
         * These can be set from the Sqwidget.globalConfig()
         * All global settings need to be given an initial
         * default value here so they can be set from the globalConfig method 
         */
        settings: { // TODO: Some props (e.g. 'lightbox') would be better as props on Sqwidget.prototype, so they can be modified as instance properties. Perhaps we need global settings and instance settings.
            jQuery: {
                minVersion: '1.4.2', // minimum version of jQuery to allow, if already in DOM
                src: 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
                //src: 'jquery.js',
                // Set noConflict properties to true to avoid global '$' and/or 'jQuery' variables in the global namespace. If '$' is false, then 'jQuery' is assumed to be false.
                noConflict: {
                    $: true,
                    jQuery: true
                }
            },
            development: false,
            experimental: false,
            automatic: true,
            charset: 'utf-8',
            basePath: '',
            pluginPath: 'plugins/'
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
        widgetTemplatesByType: {},
        
        /**
         * Set global configuration (config)
         * @param {Object} dictionary of global config options [optional]
         * return {Object} dictionary of the global config
         */
        globalConfig: function (dict) {
            var key;
            
            if (dict) {
                for (key in dict) {
                    if (key in this.settings) {
                        this.settings[key] = dict[key];
                    }
                }
            }
            return this.settings;
        },
        
        getConfig: function (key) {
            return Sqwidget.settings[key];
        },
        
        
        thisDomScript: function () {
            var scripts = document.getElementsByTagName("script");
            return scripts[scripts.length - 1];
        },
        
        // Wrapper around getScript, allowing cacheUrl for development
        getScript: function (srcs, callback, options) {
            var i, length;
            // Development mode: cache JavaScript files
            if (Sqwidget.getConfig('development')) {
                if (typeof srcs === 'string') {
                    srcs = [srcs];
                }
                for (i = 0; i < srcs.length; i += 1) {
                    srcs[i] = Sqwidget.cacheUrl(srcs[i], 0); // never cache
                    _('getScript: cache url: ' + srcs[i]);
                }
            }
            getScript(srcs, callback, options);
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
        
        buildResourcePath: function (base, sub, item, extension) {
            base = jQuery.trim(base);
            sub = jQuery.trim(sub);
            item = jQuery.trim(item);
            extension = jQuery.trim(extension);
            // check for absolutes
            function isAbsolute(s) {
                return (s.search(/^[a-z]+:\/\//) === 0) || (s.search(/^\//) === 0);
            }
            // if item is absolute, then just return it.
            if (isAbsolute(item)) { 
                return item; 
            }
            if (extension.length > 0 && item.lastIndexOf('.' + extension) !== (item.length - extension.length - 1)) {
                item += '.' + extension;
            }
            if (isAbsolute(sub)) {
                return sub + item;
            }
            if (base.length > 0 && !base.match(/\/$/)) {
                base += '/';
            }
            return base + sub + item;                
        },
        
        templateText: function (jsonData) {
            var myTemplate;
            _('Sqwidget.template text called');
            if (jsonData && jsonData.type) {
                myTemplate = this.widgetTemplatesByType[jsonData.type];
                if (myTemplate) {
                    _('running Template.templateText');
                    myTemplate.templateText(jsonData.template);
                }
            }
            
        },
        
        /**
         * Test if a version string is at least as high as the minimum version required
         * @returns boolean true or false
         */
        hasMinVersion: function (testVersion, minVersion) {
            return testVersion >= minVersion;
        },
        
        
        /**
          * Return jQuery object or false if minimum version can't be satisfied
          * @param {String} minVersion
          * @returns jQuery object or false
          */
        jQueryIsLoaded: function (minVersion) {
            if (!$) {
                var jQ = window.jQuery;
                if (jQ && jQ.fn && jQ.fn.jquery &&
                    this.hasMinVersion(jQ.fn.jquery, minVersion || this.settings.jQuery.minVersion)) {
                    $ = jQ;
                    jQuery = jQ;
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
        onjQueryReady: function (callback) {
            _('Sqwidget.onjQueryReady');
            var jQ, jQuerySettings, callbacks;      
            
            if (!$) {
                jQ = this.jQueryIsLoaded();
                if (jQ) {
                    _('jQuery found');
                    $ = jQ;
                    jQuery = jQ;
                }
                else {
                    _('jQuery not found');
                    jQuerySettings = this.settings.jQuery;
                    
                    // If this called for the first time, create array to store callbacks
                    callbacks = this.onjQueryReady.callbacks;
                    if (!callbacks) {
                        callbacks = this.onjQueryReady.callbacks = [];
                        // load jQuery
                        Sqwidget.getScript(jQuerySettings.src, function () {
                            $ = window.jQuery;
                            jQuery = $;
                            
                            // Hide or expose global '$' and 'jQuery' vars, depending on settings
                            if (jQuerySettings.noConflict.$) {
                                $.noConflict(jQuerySettings.noConflict.jQuery);
                            }
                            
                            // once loaded, pass jQuery to each stored callback
                            $.each(callbacks, function () {
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
        // TODO this requires DOM ready and jquery and dependencies ready
        ready: function (callback) {
            this.onjQueryReady(function () {
                Sqwidget.domReady(callback);
            });
        },

        
        // Document DOM ready
        domReady: function (callback) {
            jQuery().ready(callback);
        },
        /**
         * @returns {Array} of the full set of widgets in the DOM, returning them as 
         * as an array of SqwidgetWidget objects:
         *
         */
        widgetsInDom: function () {
            function trim(str) {
                return str.replace(/^[\0\t\n\v\f\r\s]+|[\0\t\n\v\f\r\s]+$/g, '');
            }
            
            function type(templateUrl) {
                return templateUrl.replace(/^.*\/([\w]+)(?:\.[^\/]+)?$|^([\w]+)(?:\..*)?$/, '$1$2');
            }

            /**
             * Get settings from an attribute:
             * ';' separates key:value pairs
             * Use \; to include a ';' in a value
             */
            function settings(str) {
                if (!str) {
                    return {};
                }
                function reverse(s) {
                    return s.split('').reverse().join('');
                }

                var
                    keyvalPairs = reverse(str).split(/;(?!\\)/),
                    len = keyvalPairs.length,
                    widgetSettings = {},
                    keyval, i, pos;
                    
                for (i = len; i; i -= 1) {
                    keyval = reverse(keyvalPairs[i - 1]);
                    keyval = keyval.replace('\\;', ';');
                    pos = keyval.indexOf(':');
                    if (pos !== -1) {
                        widgetSettings[trim(keyval.slice(0, pos))] = trim(keyval.slice(pos + 1));
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
            
            for (i = 0; i < divs.length; i += 1) {
                div = divs[i];
                dataSqwidget = div.getAttribute('data-sqwidget');
                dataSqwidgetSettings = div.getAttribute('data-sqwidget-settings');
                
                if (dataSqwidget) {
                    dataSqwidget = settings(dataSqwidget);
                    dataSqwidgetSettings = settings(dataSqwidgetSettings);
                    widgetType = type(dataSqwidget.src || 'generic');
                    
                    widgets.push(Widget(this, widgetType, div, dataSqwidget, dataSqwidgetSettings));
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
        getTemplate: function (templateFilename, widget) {
            // check to see if already loaded, if so, return instance.
            var 
                filename = jQuery.trim(templateFilename),
                fullName, t;
                
            if (filename.lastIndexOf('.js') === filename.length - 3) {
                // compile js template, so load as script
                fullName = this.buildResourcePath(this.settings.basePath, '', filename, 'js');
            }
            else {
                fullName = this.buildResourcePath(this.settings.basePath, '', filename, 'html');
            }
            t = this.widgetTemplates[fullName];
            if (!t) {
                t = Template(this, fullName, widget);
                this.widgetTemplates[fullName] = t;
            }
            return t;
        },
        
        /**
         * Retrieve widget template by name (to do something like call a listener/callback
         * with JSONP data for example)
         */
        getTemplateByType: function (templateType) {
            return this.widgetTemplatesByType[templateType];
        },
        
        /**
         *  Set type for the given template.
         *  Note, if a widget is reconfigured, it will get registered against a second type
         */
        setTemplateType: function (template, type) {
            this.widgetTemplatesByType[type] = template;
            template.config.type = type;
        },
        
         /**
         * Load dependencies (check that versions are satisfied, and issue script loading instructions
         * as needed)
         * @param {Object:Template} template object that wants this dependency
         * @param {Object} dependency a dependency in the form ['name', 'version'] or simply 'name'
         *
         */

        addDependency: function (widget, dependency) {  
            var 
                name = null,
                minVersion = null,
                depConfig = {},
                basePath = widget.getConfig('basePath', this.getConfig('basePath')),
                pluginPath = widget.getConfig('pluginPath', this.getConfig('pluginPath')),
                existing, loadPath;

            if (!dependency) {
                name = null;
            }
            else if (typeof(dependency) === 'string') {
                name = dependency;
            }
            else if (typeof(dependency === 'object')) {
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
            else {
                name = null;
            }
            if (name && name.length > 0) {
                existing = this.dependencyRegister[name];
                if (existing) {
                    _('adding dependency (already exists): ' + name);
                    //TODO version comparison
                    existing.clients.push(widget);
                    if (existing.loaded) {
                        _('setting plugin (already loaded): ' + name);
                        widget.setPlugin(existing.name, existing.module, depConfig);
                    }
                    else {
                        _('waiting for plugin load: ' + name);
                    }
                }
                else {
                    this.dependencyRegister[name] = {name: name, version: minVersion, loaded: false, module: null, clients: [widget], config: depConfig};
                    // initiate load
                    _(basePath, pluginPath);
                    loadPath = this.buildResourcePath(basePath, pluginPath, name, 'js');
                    _('loading dependency: '  + name + ', ' + loadPath);
                    Sqwidget.getScript(loadPath);
                }
            }
        },
        
        getDependencyRegister: function () {
            return this.dependencyRegister;
        },
        
        /**
         * Review all dependencies
         * @return {Boolean} true if all dependencies satisfied
         */
        checkDependencies: function (widgetClient) {
            var c, d;
            for (d in this.dependencyRegister) {
                if (this.dependencyRegister.hasOwnProperty(d)) {
                    if (!(this.dependencyRegister[d].loaded)) {
                        for (c = 0; c < this.dependencyRegister[d].clients.length; c += 1) {
                            if (this.dependencyRegister[d].clients[c] === widgetClient) {
                                return false;
                            }
                        }
                    }
                    else {
                        for (c = 0; c < this.dependencyRegister[d].clients.length; c += 1) {
                            if (this.dependencyRegister[d].clients[c] === widgetClient) {
                                if (typeof widgetClient.plugins[this.dependencyRegister[d].name] === 'undefined') {
                                    return false;
                                }
                            }
                        }                            
                    }
                }
            }
            return true;
        },
        
        /**
         * Called by plugins to register themselves.   Plugins can show up here before appearing 
         * in a list of dependencies, so need to allow this to add a dependency record
         * @param {String} name the namespace name for this thing
         * @param {Object} module the module constructor. Call to create an object of this type
         * @param {String} version the version of this plugin 
         *
         */
         
        plugin: function (name, module, version) {
            _('plugin registration: ', name, version);
            var dep = this.dependencyRegister[name],
                i, clients;
            if (typeof(dep) === 'undefined') {
                // add a new entry for this plugin, not requested yet but already loaded
                // which isn't a problem
                this.dependencyRegister[name] = {
                    name: name,
                    module: module,
                    loaded : true,
                    version : version,
                    clients : [],
                    config : {}
                };
            }
            else {
                dep.name =  name;
                dep.module = module;
                dep.loaded = true;
                dep.version = version;
                jQuery.each(dep.clients, function (i, client) {
                    client.setPlugin(name, module, dep.config);
                });
            }
        },
        

        runAll: function () {
            jQuery.each(this.widgetTemplates, function (wt, template) {
                template.runAll();
            });
        },

        /**
         * Locate and start widgets in this page. Typically called by Sqwidget.ready() function
         */
        startWidgets: function () {
            var widgets = Sqwidget.widgetsInDom(); // get widgets in the page as Widget objects

            _('found ' + widgets.length.toString() + ' widget divs:');

            _('initing widgets...');
            // load templates as needed
            jQuery.each(widgets, function (w, widget) {
                _('init for w: ' + widgets[w].toString());
                widget.init();
            });    
            jQuery.each(widgets, function (w, widget) {
                _('checkrun for w: ' + widgets[w].toString());
                widget.checkRun();
            });
        }
    };
    /////


// Sqwidget - extend Sqwidget once jQuery is loaded, and assign to Sqwidget
// *********
    Sqwidget.onjQueryReady(function (jQuery) {
        var $ = jQuery,
            namespace = 'sqwidget';
        
        function ns(props, delimiter) {
            delimiter = delimiter || '-';
            if (!props) {
                return namespace;
            }
            else if (typeof props === 'string') {
                return namespace + delimiter + props;
            }
            else {
                return [namespace].concat(props).join(delimiter);
            }
        }
        
        // EXTEND SQWIDGET WITH JQUERY-DEPENDENT PROPS
        this.Sqwidget = Sqwidget = $.extend(
            // Original Sqwidget object
            Sqwidget,
            {
                // Static Methods & Properties
                //TODO separate widget template functions from sqwidget page management
                // do as: Lightbox.uid = Sqwidget.prototype.uid
                
                widgets: [],

                isElement: function (obj) {
                    return obj && obj.nodeType === 1;
                },

                isJQuery: function (obj) {
                    return obj && !!obj.jquery;
                },

                // Test whether the str is *probably* a url. It does not attempt to validate the url.
                isUrl: function (str) {
                    return (/^https?:\/\/[\-\w]+\.\w[\-\w]+\S*$/).test(str);
                },

                // random number. Default: maximum of 4 digits
                rand: function (maxDigits) {
                    var m = Math;
                    return m.floor(
                        m.random() * m.pow(10, maxDigits || 4)
                    );
                },
                
                cssPresets: {        
                    contentonly: {
                        margin: 0,
                        padding: 0,
                        borderWidth: 0
                    }
                },
                
                // Notify the global window object about desired internal events of a Sqwidget object
                    // E.g. bind listener to window:
                    //   $(window).bind('sqwidget', function(jQueryEventObject, sqwidgetEvent){
                    //     if (sqwidgetEvent.type === 'overlay.add'){
                    //       doStuff(sqwidgetEvent.origin);
                    //     }
                    //   });
                notifyGlobalWindow: function (origin, eventTypes, namespace) { 
                    // origin is originating object (e.g. Overlay instance), eventTypes is array
                    // (e.g. ['add', 'remove']), namespace is optional - if not provided, the 
                    // origin must have a 'type' property (e.g. 'overlay')
                    
                    $.each(eventTypes, function (i, type) {
                        try {
                            $(origin)
                                .bind(type, function () {
                                    $(window).trigger(ns(), {type: (namespace || origin.type) + '.' + type, origin: this});
                                });
                        }
                        catch (e) {
                            _('catch', $);
                        }
                    });
                },
                
                // Setter: Add a query string parameter to a url. E.g. addUrlParam('http://example.com?v=1', 'this', 'that');
                // TODO: Getter: if no value supplied, then get param value
                urlParam: function (url, param, value) {
                    return url + (!/\?/.test(url) ? '?' : '&') + param + '=' + value;
                },
                
                // Return a fixed number (which may be considered arbitrary) when passed an interval of time (in days; may be decimal part of day, e.g. 1/24 for 1 hour)
                // Useful for breaking server caching of resources after a specified interval of time. E.g. "http://example.com/data.js?cache=" + timeChunk(30);
                timeChunk: function (intervalDays) {
                    var decimalPlaces, baseline, msInADay, interval, now, chunk;
                    decimalPlaces = 6; // Allows accuracy to nearest minute
                    baseline = new Date(2009, 0, 1).getTime(); // Used simply to keep the number of chars down
                    msInADay = 24 * 60 * 60 * 1000;
                    interval = intervalDays * msInADay;
                    now = new Date().getTime();
                    if (!intervalDays) {
                        return now;
                    } 
                    else {
                        chunk = now - (now % Math.round(interval)); // Math.round used to avoid JavaScript float point error
                    }
                    return Number(((chunk - baseline) / msInADay).toFixed(decimalPlaces)) || 0;
                },
                
                cacheUrl: function (url, intervalDays) {
                    return this.urlParam(url, 'cache', this.timeChunk(intervalDays));
                },
                
                // preload images - argument is either string or array of strings
                preload: function (srcs) {
                    $.each($.isArray(srcs) ? srcs : [srcs], function (i, src) {
                        var img = $('<img src="' + src + '" />');
                    });
                },

                // ================

                // Instance methods
                // TODO: A number of these methods should be moved to static functions on the Sqwidget object
                prototype: $.extend(
                    function () {},
                    {
                        // Insert widget HTML, DOM node or jQuery object into the DOM, afer the <script> element that originally created the widget instance. This position is cached, for later retri  .
                        // Optional args: insertPosition to override last in body; verb to use for adding content - default 'after' (could use 'before', 'append', 'prepend', etc)
                        // TODO: clarify how this is connected with method to replace DOM contents (e.g. as .html(newContents))
                        // TODO: Does this really need to store the insertPosition? In fact, is this method even required?!
                        insert: function (contents, insertPosition, verb) {
                            var $context = this.insertPosition = $(insertPosition || this.insertPosition || this.thisDomScript());
                            if (!$context) {
                                return false;
                            }
                            // If no arguments, return the current context
                            if (!contents) {
                                return $context;
                            }
                            $context[verb || 'after'](contents);
                            return $(contents);
                        },
                        
                        // Truncate a str to a specific number of words; optional arg: trailer string - default '…'
                        truncate: function (str, numWords, trailer) {
                            var newStr = String(str).replace(new RegExp('^((\\W*\\w*\\b){0,' + numWords + '}\\.?).*$', 'm'), '$1');
                            return newStr + (newStr.length < str.length ? (trailer || '\u2026') : '');
                        },
                    
                        // Repeat a string num times 
                        repeat: function (str, repeats) {
                            return repeats > 0 ? new Array(repeats + 1).join(str) : '';
                        },
                        
                        // Return a number with leading zeroes, up to total length of number string
                        leadingZeroes: function (num, totalLength) {
                            return this.repeat('0', (totalLength || 2) - String(num).length) + num;
                        },
 
                        // Parse an atom date string and return as a JS Date object. E.g. '2007-10-29T23:39:38+06:00'
                        // TODO: Detect if arg is Date obj, and return as Atom date string
                        atomDate: function (atomDateStr) {
                            var d, n, plusminus;
                            
                            // Convert 'Z' UTC to '+00:00' and split to array
                            atomDateStr = atomDateStr.replace(/z$/i, '+00:00');
                            d = atomDateStr.split(/[\-T:+]/);  // TODO: Confirm this is fine in IE6
                            n = Number;
                                
                            if (d.length !== 8) {
                                return false;
                            }              
                            // Timezone + / -
                            plusminus = atomDateStr.substr(19, 1);
                            
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
                    
                        loadCss: function (css, cacheTime) {
                            cacheTime = cacheTime || this.settings.cssCacheTime;
                            
                            // Simple check to tell difference between css text and a url - this does not attempt to validate CSS
                            // Check for '@' or "{" - e.g. with @import or div{color:red};
                            function isCss(str) {
                                return (/@|\{/m).test(str);
                            }
                            $('head').append(
                                isCss(css) ? 
                                    '<style type="text/css">' + css + '</style>' :
                                    '<link type="text/css" rel="stylesheet" href="' + (cacheTime ? this.cacheUrl(css, cacheTime) : css) + '" />'
                            );
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
    
    Template = function (s, t, widget) {
        var 
            self = {}, //neoclassical
            sqwidget = s,
            templateType = t,
            /** set of widgets (instances on the page) for this template */
            widgets = [],
            templates = {},
            /** javascript blocks to be executed in context of widget */
            scripts = [],
            styles = [],
            plugins = {},
            templateText = '',
            loaded = false,
            dependenciesLoaded = false,
            /** errors noted on template load */
            errors = [],
            /** template config. default values here */
            templateConfig = {
                "name": "sqwidget_template",
                "version": "1",
                "title": "Generic sqwidget widget",
                "desc": "-",
                "url": "http://github.com/sqwidget", 
                "ui" : "hostpage",
                "basePath" : null,
                "pluginPath" : null,
                "dependencies": {
                },
                "settings": {                 
                }
            };
        
        if (widget) {
            widgets.push(widget);
        }

        // PRIVATE methods
        
        function parseTemplateFile(template) {
            _('parsing template file for ' + templateType);
            // TODO document type detection (doctype tells us it is HTML or similar)
            // For now: default body html stored -- and activated immediately
            var 
                templateStr, head = null, body = null,
                s = splitdoc(template),
                j;
                
            head = s.headContents;
            body = s.bodyContents;
            if (head) {
                templateStr = head;
            }
            else {
                templateStr = template;
            }
            _('template: ' + templateType, {head: head, body: body});
            if (body !== null) {
                templates['default'] = body;
            }
            // grab script templates - from the HEAD only for templates other than the default
            j = jQuery(templateStr);
            j.filter('script[type=text/template][id]')
             .each(function (i, t) {
                t = jQuery(t);
                templates[t.attr('id')] = jQuery.trim(t.html());
            });
            
            //
            // grab javascripts from head and execute in order
            //
            j.filter('script:not([type]), script[type=text/javascript]')
             .each(function (i, t) {
                t = jQuery(t);
                scripts.push(t.html());
            }); 
            
            // capture css
            // and move
            // TODO -- capture media attributes as well
            j.filter('style')
                .each(function (i, t) {
                    t = jQuery(t);
                    styles.push({text: t.html(), media: t.attr('media'), type: t.attr('type'), title: t.attr('title')});
                });
            //TODO hook for style injection -- not done for now
            // modes -- simple injection with container div added
            _('styles', styles);
            jQuery.each(styles, function (s, style) {
                var ss = jQuery('<style>' + style.text + '</style>');
                ss.attr({title: style.title, type: style.type, media: style.media});
                jQuery('head').append(ss);
            });
        }
        
        function initWidgets() {
            jQuery.each(widgets, function (w, widget) {
                _('running controller for ' + widget.toString());
                widget.onTemplateLoaded(self);
            });
        }
        
        function showErrorsInWidgets() {
            if (sqwidget.settings.development) {
                jQuery.each(widgets, function (w, widget) {
                    widget.render('<div style="color: red;border:1px dashed red;">Sqwidget Errors:<ul><li>' + errors.join('</li><li>') + '</li></ul></div>');
                });
            }
        }

        function loadTemplate() {
            function props(a) {
                var r = [], key;
                for (key in a) {
                    if (a.hasOwnProperty(key)) {
                        r.push(key + ': "' + a[key] + '"');
                    }
                }
                return '{' + r.join(' ') + '}';
            }
            
            var type, tn;
            _('template full name is ' + templateType);
            // extract name and save it for later
            try {
                // annoying regex issue to be sorted out sometime
                // filename match doesn't work unless pathed so adding './' to keep things happy
                tn = templateType;
                if (tn.indexOf('/') === -1) {
                    tn = './' + tn;
                }
                type = tn.match(/(.*)[\/\\]([^\/\\]+)\.\w+$/)[2];
            }
            catch (e) {
                type = templateType;
            }
            _('template type is ' + type);
            sqwidget.widgetTemplatesByType[type] = self;
            templateConfig.type = type;
            
            
            //path to the base 
            if (templateType.lastIndexOf(".js") === templateType.length - 3) {
                Sqwidget.getScript(templateType); // this will call the Sqwidget.templateText method
            }
            else {
            
                jQuery.get(templateType, function (data, textStatus, request) {
                    // on template loaded
                    _('template data: ' + data);
                    _('template text status: ' + textStatus);
                    if (data.length === 0 || textStatus !== 'success') {
                        // template load failed
                        errors.push('loading of template ' + templateType + ' failed.');
                    }
                    else {
                        _('template loaded');                
                        templateText = data;
                        parseTemplateFile(templateText);
                        _('templates: ' + props(templates));
                        loaded = true;
                    }
                    if (errors.length === 0) {
                        // run controllers to set up dependencies via template.config, and
                        // then resolve and load dependencies
                        initWidgets();
                        //runControllers();
                        if (errors.length !== 0) {
                            showErrorsInWidgets();
                        }
                    }
                    else {
                        showErrorsInWidgets();
                    }
                }, 'text');
            }
        }
        
        
        function setLoading() {
            jQuery.each(widgets, function (w, widget) {
                widget.showLoading();
            });
        }
        

        

        
        
        // PUBLIC methods   
        /**
         * Register this widget with this template
         *
         */
         
        self.widgets = widgets;
        
        
        self.templateText = function (t) {
            parseTemplateFile(t);
            loaded = true;
            if (errors.length === 0) {
                // run controllers to set up dependencies via template.config, and
                // then resolve and load dependencies
                initWidgets();
                //runControllers();
                if (errors.length !== 0) {
                    showErrorsInWidgets();
                }
            }
            else {
                showErrorsInWidgets();
            }
        };
        
        
        self.register = function (widget) {
            var i;
            for (i = 0;i < widgets.length; i += 1) {
                if (widget === widgets[i]) {
                    return;
                }
            }
            widgets.push(widget);
        };

        self.config = function (dict) {
            var key;
            
            if (dict) {
                for (key in dict) {
                    if (key in templateConfig) {
                        templateConfig[key] = dict[key];
                    }
                }
                sqwidget.setTemplateType(self, templateConfig.name);
            }
            return templateConfig;
        };
        
        self.getConfig = function (key) {
            return templateConfig[key];
        };
        
        self.getSetting = function (key) {
            return templateConfig.settings[key];
        };
        
        self.loadDependencies = function (widget) {
            jQuery.each(templateConfig.dependencies, function (i, dep) {
                sqwidget.addDependency(widget, dep);
            });
        };

        self.getScripts = function () {
            return scripts;
        };
        
        self.getTemplate = function (name) {
            return templates[name];
        };
        
        self.setPlugin = function (name, module) {
            plugins[name] = module;
        };
        
        self.getStyles = function () {
            return styles;
        };
        
        self.runAll =  function () {
            jQuery.each(this.widgets, function (wt, template) {
                template.checkRun();
            });
        };
        

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
    Widget = function (sq, type, div, dataSq, dataSqSet) {
        var 
            self = {},
            sqwidget = sq,
            widgetType = type,
            container = div,
            dataSqwidget = dataSq,
            settings = dataSqSet,
            template = null,
            plugins = {},
            readyFn = null,
            errorFn = null,
            loadingFn = null,
            readyRun = false,
            templateLoaded = false,
            dependenciesRequested = false;
        /**
         * eval script in the context of this object
         * @param {String} string of script to eval. Should be text/javascript
         * @return {undefined}
         */
        function evalScript(script) {
            _('eval script', {source: script});
            var widget = self;
            //TODO minimise context for controller functions
            eval(script.toString());
        }
        
        /**
         * TODO
         * Check we have all plugins namespaced, er how do we know
         */
        function allPluginsLoaded() {
            return (dependenciesRequested && sqwidget.checkDependencies(self));
        }
        
        function props(a) {
            var r = [], key;
            for (key in a) {
                if (a.hasOwnProperty(key)) {
                    r.push(key + ': "' + a[key] + '"');
                }
            }
            return '{' + r.join(' ') + '}';
        }
         
        self.plugins = plugins;
        self.allPluginsLoaded = allPluginsLoaded;
        
        /**
         * set template config dict
         * This used to allow widget.config({..}); in intial embed
         */
        self.config = function (dict) {
            template.config(dict);
        };
        
        self.getContainer = function () {
            return container;
        };
        
        self.getReadyFn = function () { 
            return readyFn;
        };

        self.getReadyRun = function () { 
            return readyRun;
        };
        
        /**
         * Return unique Id for widget... either a stored id or 
         * the id of the widget container div.
         */
        // TODO use the template name if not available in the container
        self.getId = function () {
            if (settings.hasOwnProperty('id')) {
                return settings.id;
            }
            else {
                return container.id;
            }
        };
        
        self.onTemplateLoaded = function (t) {
            templateLoaded = true;
            template = t;
            self.runController(template.getScripts());
            self.showLoading(); 
            template.loadDependencies(self);
            dependenciesRequested = true;
            self.checkRun();
        };
        
        self.setPlugin = function (name, module, config) {
            _('setting up plugin: ' + name + ' for widget ' + self.getId());
            plugins[name] = module(sqwidget, self, jQuery, config);
            //TODO check all plugins loaded
            // TODO: merge this block with .checkRun() method below
            if (allPluginsLoaded()) {
                self.checkRun();
            }
            sqwidget.runAll();
        };
        
        self.checkRun = function () {
            if (allPluginsLoaded()) {
                if (!readyRun) {
                    readyRun = true;
                    if (readyFn) {
                        var widget = self,
                            widgetWrapper = jQuery(widget);
                            
                        _('calling widget.ready(): ' + container.id);
                        widgetWrapper.trigger('readyStart');
                        readyFn.call(self);
                        widgetWrapper.trigger('readyEnd');
                    }
                    else {
                        //TODO decide what extra contents will be displayed here
                        self.setTemplate('default', {}, null);
                    }
                }
            }            
        };
        
        /**
         * Create a body element (ie a popup) appended to the body 
         * element.
         * For later:  security here?
         *
         */
        self.getBodyElement = function (idSuffix) {
            var 
                elId = self.getId() + '_' + idSuffix,
                el = jQuery('#' + elId),
                div;
            if (el.length) {
                return el;
            }
            else {
                div = jQuery('<div></div>').attr('id', elId).css('display', 'none');
                jQuery('body').append(div);
                return div;
            }
        };
        
        
        //TODO fit this into the proper place
        self.ui = {
            head: function (content) {
                $('head').append(content);
            },
            body: function (content) {
                container.empty().append(content);
            }
        };
        
        /**
         * Register controller function(s) to be executed when all plugins loaded
         *
         */
         
        self.ready = function (fn) {
            readyFn = fn;
        };
        
        self.loading = function (fn) {
            loadingFn = fn;
        };
        
        self.error = function (fn) {
            errorFn = fn;
        };
        
        self.getReadyFn = function () {
            return readyFn;
        };
        
        self.callReady = function () {
            return readyFn.call(self);
        };
        
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
        

        
        // PUBLIC METHODS
        
        /**
         * Get this widget up and running
         */
        self.init = function () {
            //attach ourselves to template -- this also loads the template if that hasn't happened before
            _('  getting template');
            var sqTemplate = sqwidget.getTemplate(dataSqwidget.src, self);
            template = sqTemplate;
            _('  registering widget');
            sqTemplate.register(self);
            _('   widget registered');            
        };
                
        /**
         * Get a setting from, here or template or global config
         * @param {String} key key to search for
         * @param {Object} default Default value to apply if none comes from config
         * @returns {Object} settings or config value
         * Hierarchy here is data-sqwidget-settings, template config settings
         */
        self.getSetting = function (key, defaultValue) {
            return settings[key] || template.getSetting(key) || defaultValue;
        };

        /**
         * Get a config item from widget here or template or global config
         * @param {String} key key to search for
         * @param {Object} default Default value to apply if none comes from config
         * @returns {Object} settings or config value
         * Hierarchy here is data-sqwidget, template config
         */        
        self.getConfig = function (key, defaultValue) {
            return dataSqwidget[key] || template.getConfig(key) || sqwidget.getConfig(key) || defaultValue;
        };
        
        
        /**
         * Render html into this widget
         * @param {String} html Inner html to be rendered into the div for this widget
         * @param {jQuery} place The place to render into [optional]. Otherwise, 
         * TODO: cache, keep existing content to pop out etc -- page management kind of stuff
         */ 
        self.render = function (html, contents, place) {
            var 
                s = self.renderTemplate(html, contents),
                p = place || container;
            jQuery(p).html(s);
        };
       
       /**
        * Show the loading template.  But don't if a placeholder is present
        */
        self.showLoading = function () {
            var 
                widget = self,
                t;
            if (jQuery('.sqwidget-placeholder', container).length === 0) {
                if (loadingFn) {
                    loadingFn.call(self);
                }
                else {
                    t = template.getTemplate('loading');
                    if (t) {
                        self.render(t);
                    }
                }
            }
        };
       
       /**
        * Render contents with named template
        * TODO complete docs here 
        */
        self.renderWithTemplate = function (name, contents) {
            var d = template.getTemplate(name);
            return self.renderTemplate(d, contents); 
        };
       /**
        * Render html into this widget
        * @param {String} html Inner html to be rendered into the div for this widget
        * @param {jQuery} place The place to render into [optional]. Otherwise, 
        * TODO: cache, keep existing content to pop out etc -- page management kind of stuff
        */        
        self.setTemplate = function (type, contents, place) {
            var d = template.getTemplate(type);
            if (d) {
                self.render(d, contents, place);
            }
        };

       /**
        * tim.js
        * http://gist.github.com/521352
        * A simple, safe and secure JavaScript micro-templating function.
        * It doesn't use eval or (new Function), so it cannot execute malicious code.
        * @param {String} template data to have template tag matching performed on
        * @param {Object} data Data to render into template as keyed values
        */
        self.renderTemplate = tim;
        
        /**
         * Run the script controller
         */
        self.runController = function (scripts) {
            _('  running controller scripts..');
            jQuery.each(scripts, function (s, script) {
                evalScript(scripts[s]);
            });
        };
        
        /**
         * toString to expose widget params
         * @return {String}
         */
         
        self.toString = function () {
            return 'type: ' + widgetType + ' container id: ' + div.id + ' dataSqwidget: ' + props(dataSqwidget) + ' dataSqwidgetSettings: ' + props(settings);
        };
        
        // TEMP: jQuery has a bug that is to be released in v1.4.3 - in the meantime, jQuery errors on unbinding custom events from a plain native JavaScript object: http://forum.jquery.com/topic/javascript-error-when-unbinding-a-custom-event-using-jquery-1-4-2
        if (!Sqwidget.hasMinVersion(jQuery.fn.jquery, '1.4.3')) {
            self.addEventListener = self.removeEventListener = function () {};
        }
        
        return self;
    };
    
    // TEMP global exposure to play with classes

    window.SqwidgetTemplate = Template;
    window.SqwidgetWidget = Widget;

        

    
}());


// On DOM ready loading to be done
// TODO proper metaphors for calling this
// a default function here, but can be overridden if called by the doc?

Sqwidget.ready(function () {
    if (Sqwidget.settings.automatic) {
        Sqwidget._('sqwidget (on automatic) loading and starting widgets');
        Sqwidget.startWidgets();
    }
});
 

