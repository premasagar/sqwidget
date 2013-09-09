window.Sqwidget = (function(window, document){
	"use strict";

	var version = '2.0.0',
		unsupported;

	// Check browser support
	if (
		!('querySelectorAll' in document)
	){
		unsupported = function(){};
		unsupported.version = version;
		unsupported.isSupported = false;
		return unsupported;
	}

	/////


	function trim(str){
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}


	function extend(target/*, any number of source objects*/){
        var len = arguments.length,
            withPrototype = arguments[len-1] === true,
            i, obj, prop;
        
        if (!target){
            target = {};
        }

        for (i = 1; i < len; i++){
            obj = arguments[i];
            if (typeof obj === 'object'){
                for (prop in obj){
                    if (withPrototype || obj.hasOwnProperty(prop)){
                        target[prop] = obj[prop];
                    }
                }
            }
        }
        return target;
    }


	/* contentloaded.js by Diego Perini
	 * http://javascript.nwbox.com/ContentLoaded/
	 * https://github.com/dperini/ContentLoaded
	 */
	function contentLoaded(win, fn) {

		var done = false, top = true,

		doc = win.document, root = doc.documentElement,

		add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
		rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
		pre = doc.addEventListener ? '' : 'on',

		init = function(e) {
			if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
			(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
			if (!done && (done = true)) fn.call(win, e.type || e);
		},

		poll = function() {
			try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
			init('poll');
		};

		if (doc.readyState == 'complete') fn.call(win, 'lazy');
		else {
			if (doc.createEventObject && root.doScroll) {
				try { top = !win.frameElement; } catch(e) { }
				if (top) poll();
			}
			doc[add](pre + 'DOMContentLoaded', init, false);
			doc[add](pre + 'readystatechange', init, false);
			win[add](pre + 'load', init, false);
		}

	}


	/////


	function Widget(el, settings){
		this.el = el;
		this.settings = settings || {};
	}


	/////

	
	function Sqwidget(){

	}


	/////


	extend(Sqwidget, {
		version: version,
		isSupported: true,
		widgets: [],
		extend: extend,
		trim: trim,

		domReady: function(callback){
			contentLoaded(window, callback);
			return this;
		},

		getElements: function(){
			return document.querySelectorAll('[data-sqwidget]');
		},

		parseParameters: function(str){
			var // TODO: uses regex to allow backslash escaping of semicolons
				keyValues = str.split(';'),
				length = keyValues.length,
				ret = {},
				i, keyValue, key, value;

			for (i=0; i<length; i++){
				if (keyValues[i] !== ''){
					// TODO: uses regex to allow backslash escaping of colons
					keyValue = keyValues[i].split(':');
					key = trim(keyValue[0]);
					value = trim(keyValue[1]);
					ret[key] = value;
				}
			}
			return ret;
		},

		getParameters: function(element){
			var paramString = element.getAttribute('data-sqwidget');
			return this.parseParameters(paramString);
		}
	});


	/////


	Sqwidget.domReady(function(){
		var elements = Sqwidget.getElements(),
			length = elements.length,
			i, el, settings, widget;

		for (i=0; i<length; i++){
			el = elements[i];
			settings = Sqwidget.getParameters(el);
			widget = new Widget(el, settings);
			Sqwidget.widgets.push(widget);
		}
	});
	
	return Sqwidget;

}(window, window.document));
