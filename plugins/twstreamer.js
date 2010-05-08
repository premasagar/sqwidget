/**
 * TwStreamer
 * wrapper for http://github.com/r/twstreamer
 */
 
/*jslint nomen: false*/
/*global Sqwidget,window */    

(function(){

    Sqwidget.plugin('twstreamer', function (sqwidget, widget, $) {
        var 
            plugin,
            _ = sqwidget._ || window._ || function () {},
            
            handler = function(){},
            streamer = $('<div id="twstreamer"></div>').appendTo('body'),
            user, pass;
            
        plugin = {
            config: {
                path: '/1/statuses/filter.json?track=twitter'
            },
        
            credentials: function(username, password){
                user = username;
                pass = password;
                return this;
            },
        
            connect: function(streamHandler){
                var path = plugin.config.path;
                handler = streamHandler;
                    
                if (path && user && pass){
                    streamer.flash(function(){
                        this.ConnectToStream(path, user, pass);
                    });
                    return true;
                }
                return false;
            },

            disconnect: function(){
                streamer.flash(function(){
                    this.DisconnectFromStream();
                });
                return true;
            }
        };
        
        // HACK: connect global window var to method
        window.streamEvent = handler;

        return plugin;
    
    }, '0.1.0', ['jquery, swfobject']);

}());
