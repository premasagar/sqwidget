'use strict';
/*
    Sqwidget plugin wrapper of important.js
        github.com/premasagar/important/
*/


(function(){


    Sqwidget.plugin('important', function(sqwidget, widget, jQuery, options){
        /////////////////////////////////////////

        /*!
        * !important
        *   github.com/premasagar/important/
        *
        *//*
            css !important manipulator (jQuery plugin)

            by Premasagar Rose
                dharmafly.com

            license
                opensource.org/licenses/mit-license.php
        
            v0.1

        *//*
            creates methods
                jQuery.important()
                jQuery(elem).important()
        
            optionally modified the native jQuery CSS methods: css(), width(), height(), animate(), show() and hide(), allowing an optional last argument of boolean true, to pass the request through the !important function
    
            use jQuery.important.noConflict() to revert back to the native jQuery methods, and returns the overriding methods
    
            reference
                http://www.w3.org/TR/CSS2/syndata.html#tokenization

        */
        (function($){

            // create CSS text from property & value, optionally inserting it into the supplied CSS rule
            // e.g. declaration('width', '50%', 'margin:2em; width:auto;');
            function cssDeclaration(property, value, rules){ // if value === null, then remove from style; if style then merge with that
    
                // return a regular expression of a declaration, with the backreferences as the CSS property and the value
                function regexDeclaration(property){
                    return new RegExp('(?:^|\\s|;)(' + property + ')\\s*:\\s*([^;]*(?:;|$))', 'i');
                }
                function find(property, rules){
                    var match = rules.match(regexDeclaration(property));
                    if (match){
                        // a bit inelegant: remove leading semicolon if present
                        match[0] = match[0].replace(/^;/, '');
                    }
                    return match;
                }
    
                var oldDeclaration, newDeclaration, makeImportant;
        
                rules = rules || '';
                oldDeclaration = find(property, rules);
            
                if (value === null){
                    newDeclaration = '';
                }
                else if (typeof value === 'string'){
                    newDeclaration = property + ':' + value + ' !important;';
                }
        
                if (oldDeclaration){
                    if (typeof value === 'boolean'){
                        makeImportant = value;
                        newDeclaration = $.important(property + ':' + oldDeclaration[2], makeImportant);
                    }
                    rules = rules.replace(oldDeclaration[0], newDeclaration);
                }
        
                else if (typeof newDeclaration !== 'undefined'){
                    rules = $.trim(rules);
                    if (rules !== ''){
        	            if (rules.slice(-1) !== ';'){
        		            rules += ';';
        	            }
        	            rules += ' ';
                    }
                    rules += newDeclaration;
                }
                return rules;
            }
    
    
            // Add !important to CSS rules if they don't already have it
            function toImportant(rulesets, makeImportant){
                // Cache regular expression
                var re = toImportant.re;
                if (!re){
                    re = toImportant.re =
                        /\s*(! ?important)?[\s\r\t\n]*;/g;
                        // TODO: Make this regexp handle missing semicolons at the end of a ruleset
                }
                if (makeImportant === false){
                    return rulesets.replace(re, ';');
                }
                return rulesets.replace(re, function($0, $1){
                    return $1 ? $0 : ' !important;';
                });
            }
    
            function htmlStylesToImportant(html, makeImportant){
                // Cache regular expression
                var re = htmlStylesToImportant.re;
                if (!re){
                    re = htmlStylesToImportant.re =
                        /(?=<style[^>]*>)([\w\W]*?)(?=<\/style>)/g;
                }
                return html.replace(re, function($0, rulesets){
                    return toImportant(rulesets, makeImportant);
                });
            }
    
            // **
    
            var
                important = false,
                original = {},
                controller = {},
                replacement = $.each(
        	        {
        	            css:
                            function(property, value){
        	                    var
        	                        rulesHash = {},
        	                        elem = $(this),
        	                        rules = elem.attr('style');	                    
	                    
        	                    // Create object, if arg is a string
        	                    if (typeof property === 'string'){
                                    // CSS lookup
        	                        if (typeof value === 'undefined'){
                                        return original.css.apply(this, arguments);
        	                        }
	                    
        		                    rulesHash[property] = value;
        	                    }
        	                    else if (typeof property === 'object'){
        	                        rulesHash = property;
        	                    }
        	                    else {
        	                        return elem;
        	                    }
        	                    $.each(rulesHash, function(property, value){
        	                        rules = cssDeclaration(property, value, rules);
        	                    });
        	                    return elem.attr('style', rules);
                            }
                    
                            // TODO: other methods to be supported
                            /*,
	            
        	                width: function(){},
        	                height: function(){},
        	                show: function(){},
        	                hide: function(){},
        	                animate: function(){}
        	                */
        	        },
	        
        	        function(method, fn){
        	            original[method] = $.fn[method];
        	            fn.overridden = true; // for detecting replacementn state
	        
        	            controller[method] = function(){
        	                var
        	                    args = $.makeArray(arguments),
        	                    lastArg = args[args.length-1],
        	                    elem = $(this);
	                
        	                // boolean true passed as the last argument
        	                if (lastArg === true){
        	                    return fn.apply(elem, args.slice(0,-1));
        	                }
        	                // $.important() === true && boolean false not passed
        	                else if (important && lastArg !== false){
        	                    return fn.apply(elem, args);
        	                }
        	                // apply original, native jQuery method
        	                return original[method].apply(elem, args);
        	            };
        	        }
        	    );
	
        	// Override the native jQuery methods with new methods
        	$.extend($.fn, controller);
    
    
            // jQuery.important
            $.important = $.extend(
                function(){
                    var
                        args = $.makeArray(arguments),
                        makeImportant, cacheImportant;
            
                    if (typeof args[0] === 'string'){
                        if (typeof args[1] === 'undefined' || typeof args[1] === 'boolean'){
                            makeImportant = (args[1] !== false);
                    
                            return (/<\w+.*>/).test(args[0]) ?
                                 htmlStylesToImportant(args[0], makeImportant) :
                                 toImportant(args[0], makeImportant);
                        }
                    }
            
                    // If a function is passed, then execute it while the !important flag is set to true
                    else if ($.isFunction(args[0])){
                        cacheImportant = important;
                        $.important.status = important = true;
                        args[0].call(this);
                        $.important.status = important = cacheImportant;
                    }
            
                    else if (typeof args[0] === 'undefined' || typeof args[0] === 'boolean'){
                        $.important.status = important = (args[0] !== false);
                    }
            
                    return important;
                },
                {
                    status: important,
        
                    // release native jQuery methods back to their original versions and return overriding methods
                    noConflict: function(){
                        $.each(original, function(method, fn){
                            $.fn[method] = fn;
                        });
                        return replacement;
                    },
            
                    declaration: cssDeclaration
                }
            );
	    
	
        	// jQuery(elem).important()
        	$.fn.important = function(method){
                var
                    elem = $(this),
                    args = $.makeArray(arguments).concat(true),
                    nodeName = elem.data('nodeName'),
                    property, makeImportant, fn;
                
                // .css() is the default method, e.g. $(elem).important({border:'1px solid red'});
                if (typeof method === 'undefined' || typeof method === 'boolean'){
                    // special behaviour for specific elements
                    if (!nodeName){
                        nodeName = elem.attr('nodeName').toLowerCase();
                        elem.data('nodeName', nodeName);
                    }
                    // style elements
                    if (nodeName === 'style'){
                        makeImportant = (method !== false);
                        elem.html(
                            toImportant(elem.html(), makeImportant)
                        );
                    }
                    else {
                        elem.attr(
                            'style',
                            $.important(elem.attr('style'), method)
                        );
                    }
                    return elem;
                }
                else if (typeof method === 'object'){
                    args.unshift('css');
                    return elem.important.apply(this, args);
                }
                else if (typeof method === 'string'){
                    if ($.isFunction(controller[method])){
                        args = args.slice(1);
                        controller[method].apply(elem, args);
                    }
                    // switch the !important statement on or off for a particular property in an element's inline styles - but instead of elem.css(property), they should directly look in the style attribute
                    // e.g. $(elem).important('padding');
                    // e.g. $(elem).important('padding', false);
                    else if (typeof args[1] === 'undefined' || typeof args[1] === 'boolean'){
                        property = method;
                        makeImportant = (args[1] !== false);

                        elem.attr(
                            'style',
                            cssDeclaration(property, makeImportant, elem.attr('style'))
                        );
                    }
                }
                // pass a function, which will be executed while the !important flag is set to true
                /* e.g.
                    elem.important(function(){
                        $(this).css('height', 'auto');
                    });
                */
                else if ($.isFunction(method)){
                    fn = method;
                    $.important.call(this, fn);
                }
               
                return elem;
            };
        }(jQuery));


        /////////////////////////////////////////

    return jQuery.important;
    }, '0.1.0', ['jquery']);

}());
