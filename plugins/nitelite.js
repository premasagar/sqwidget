'use strict';

Sqwidget.plugin('nitelite', function (sqwidget, widget, jQuery, options) {

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
		                        function bindEsc(ev) {
                                    if (ev.which === 27){ // ESC key
                                        $(this).unbind('keydown', bindEsc);
                                        lb.close();
                                    }
                                }
		                        $(document).bind('keydown', bindEsc);
		                        
			                    $(lb).triggerHandler('open'); // TODO: The 'open' and 'close' events will fire before the overlay has finished fading in. Is that OK? Should triggerHandler() be called before overlay.add(); Is it better to have an 'openstart' and 'open' event, plus 'closestart' and 'close'?
			                    lb.center();
			                    return this;
			                },
			                
			                close: function(delegate, eventType){
			                    var lb = this;
			                    
			                    function closeHandler(){
			                        lb.close();
			                    }
			                    
			                    // Assign a handler element (some kind of jQuery collection) to trigger.close()
			                    if (typeof delegate !== 'undefined'){
			                        if (typeof delegate === 'string'){
			                            delegate = jQuery(delegate, lb.container);
			                        }
	                                else {
	                                    delegate = jQuery(delegate);
	                                }
	                                delegate.bind(eventType || 'click', closeHandler);
			                    }
			                    else {
			                        showFlash();
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

    return jQuery.nitelite;

}, '0.1.0', ['jquery']);

/*jslint browser: true, devel: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
