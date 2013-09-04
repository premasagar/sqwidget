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

	
	function Sqwidget(){

	}


	/////


	Sqwidget.version = version;
	Sqwidget.isSupported = true;

	Sqwidget.getElements = function(){
		return document.querySelectorAll('[data-sqwidget]');
	};
	
	
	/////
	
	return Sqwidget;

}(window, window.document));
