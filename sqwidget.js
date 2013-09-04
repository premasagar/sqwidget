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

	
	function Sqwidget(){

	}


	/////


	Sqwidget.version = version;
	Sqwidget.isSupported = true;

	Sqwidget.getElements = function(){
		return document.querySelectorAll('[data-sqwidget]');
	};
	
	Sqwidget.getParameters = function(element){
		var paramString = element.getAttribute('data-sqwidget'),
			// TODO: uses regex to allow backslash escaping of semicolons
			keyValues = paramString.split(';'),
			length = keyValues.length,
			ret = {},
			i, keyValue, key, value;

		for (i=0; i<length; i++){
			if (keyValues[i] !== ''){
				// TODO: uses regex to allow backslash escaping of colons
				keyValue = keyValues[i].split(':');
				key = keyValue[0];
				value = keyValue[1];
				ret[key] = value;
			}
		}
		return ret;
	};

	Sqwidget.ready = function(callback){
		contentLoaded(window, callback);
		return this;
	};
	
	/////
	
	return Sqwidget;

}(window, window.document));
