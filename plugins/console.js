/*!
* Console
**
    Cross-browser JavaScript debug console logging
        github.com/premasagar/console

    by Premasagar Rose
        premasagar.com
        dharmafly.com

    license:
        opensource.org/licenses/mit-license.php
        
    v1.2

*//*

    USAGE:
    _('any', 'arbitrary number', 'of', arguments);
    
    The function can easily be assigned to a different var, instead of '_'

*/

'use strict';

var _

= (function(){
    var
        win = window,
        ua = win.navigator.userAgent,
        console = win.console,
        opera = win.opera,
        debug;
    
    // Doesn't support console API
    if (!console){
        // Opera 
        return (opera && opera.postError) ?
             function(){
                 var i, argLen, log = opera.postError, args = arguments, arg, subArgs, prop;
                 log(args);
                 
                 argLen = args.length;
	             for (i=0; i < argLen; i++){
	                 arg = args[i];
	                 if (typeof arg === 'object' && arg !== null){
	                    subArgs = [];
	                    for (prop in arg){
	                        try {
	                            if (arg.hasOwnProperty(prop)){
	                                subArgs.push(prop + ': ' + arg[prop]);
	                            }
	                        }
	                        catch(e){}
	                    }
	                    log('----subArgs: ' + subArgs);
	                 }
	             }
             } :
             function(){};
    }
    // Temporary for WebKit, while its console has a bug in calling debug directly or log.apply
    else if (/webkit/i.test(ua)){	    
        return function(){
            var i, argLen, args = arguments, indent = '';
            argLen = args.length;
	        for (i=0; i < argLen; i++){
		        console.log(indent + args[i]);
                indent = '---- ';
	        }
        };
    }
    else {
        debug = console.debug;
        return debug ? // FF Firebug
	        debug :
	        function(){
		        var i, argLen, log = console.log, args = arguments, indent = '';
		        if (log){ // WebKit
			        if (typeof log.apply === 'function'){
				        log.apply(console, args);
			        }
			        else { // IE8
				        argLen = args.length;
				        for (i=0; i < argLen; i++){
					        log(indent + args[i]);
                            indent = '---- ';
				        }
			        }
		        }
	        };
	}
}());

/*jslint browser: true, devel: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
