/**
 * TwStreamer
 * JavaScript/Flash socket connection to Twitter stream API
 * modified from http://github.com/r/twstreamer
 */

(function(){

    Sqwidget.plugin('twstreamer', function(sqwidget, widget, $){
    
    ///////////////////    
    
        var 
            user,
            pass,
            plugin = {
                config: {
                    apiPath: '/1/statuses/filter.json',
                    
                    // TODO: Change swf.url to absolute path on production
                    swf: {
                        swf: Sqwidget.buildResourcePath('../../', 'plugins/', 'TwStreamFlash.swf', ''),
                        width: 1,
                        height: 1
                    }
                },
                
                init: function(){
                    streamer = $('<div id="twstreamer"></div>')
                        .appendTo('body')
                        .flash(this.config.swf);
                    return this;
                },
            
                credentials: function(username, password){
                    user = username;
                    pass = password;
                    return this;
                },
            
                connect: function(streamHandler, method, q){
                    var path = this.config.apiPath +
                        '?' + (method || 'track') +
                        '=' + (q || 'love');
                        
                    // HACK: connect global window var to method
                    window.streamEvent = streamHandler;   
                    if (path && user && pass){
                        streamer.flash(function(){
                            this.ConnectToStream(path, user, pass);
                        });
                        return this;
                    }
                    return false;
                },

                disconnect: function(){
                    streamer.flash(function(){
                        this.DisconnectFromStream();
                    });
                    return this;
                }
            };

        ///////////////////

        return plugin;
    
    }, '0.1.0', ['jquery, swfobject']);

}());
