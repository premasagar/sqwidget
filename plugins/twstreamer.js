(function(){

    Sqwidget.plugin('twstreamer', function(sqwidget, widget, $){
    var pathToSwf = Sqwidget.buildResourcePath(
        '../../',
        'plugins/',
        'TwStreamFlash.swf',
        ''
    );
    
    
///////////////////    
    
/*!*
* TwStreamer
*   by Raffi Krikorian, http://github.com/r/twstreamer
*   JavaScript API by Premasagar Rose, http://github.com/premasagar
*
*//*
    Socket connection to Twitter stream API, via Flash

    license:
        opensource.org/licenses/mit-license.php

    usage:
        jQuery.twstreamer
            .init()                     // set up Flash listener
            .credentials(myUsername, myPassword)
            .connect(
                function(tweet){        // callback
                    console.log(tweet);
                },
                'track',                // api method
                'love',                 // api query
                'some.domain.com'       // optional alternative host
            );

        // some time later...
        jQuery.twstreamer
            .disconnect();
*/

(function($){

    var
        user,       // private username
        pass,       // private password
        streamer,   // container for Flash object
        api = {
            config: {
                apiPath: '/1/statuses/filter.json',

                swf: {
                    //swf: 'TwStreamFlash.swf',
                    swf: pathToSwf,
                    width: 1,
                    height: 1
                },

                containerId: 'twstreamer', // id for container div
                globalHandler: 'streamEvent' // global variable for Flash object to call repeatedly, on pushing tweets
            },

            init: function(){
                streamer = $('<div id="'+ this.config.containerId + '"></div>')
                    .appendTo('body')
                    .flash(this.config.swf);
                return this;
            },

            credentials: function(username, password){
                user = username;
                pass = password;
                return this;
            },

            connect: function(handler, method, q, host){
                var path = this.config.apiPath +
                    '?' + (method || 'track') +
                    '=' + (encodeURIComponent(q) || 'love');
                    
                host = host || 'stream.twitter.com';

                window[this.config.globalHandler] = function(encodedTweet) {
                    var decodedTweet = $.parseJSON(
                        encodedTweet
                            .replace(/%22/g, "\"")
                            .replace(/%5c/g, "\\")
                            .replace(/%26/g, "&")
                            .replace(/%25/g, "%")
                    );
                    if (decodedTweet){
                        handler(decodedTweet);
                    }
                };
                
                if (path && user && pass){
                    streamer.flash(function(){
                        this.ConnectToStream(host, path, user, pass);
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

    jQuery.twstreamer = api;

}(jQuery));

///////////////////


    return jQuery.twstreamer;

}, '0.1.0', ['jquery, swfobject']);

}());
