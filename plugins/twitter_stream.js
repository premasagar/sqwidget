/**
 * Twitter stream - streaming twitter
 * @author Graeme Sutherland
 */
 
/*jslint nomen: false*/
/*global Sqwidget,window */    

(function(){

    Sqwidget.plugin('twitter_stream', function (sqwidget, widget, jQuery, newConfig) {
        var 
            self = {},
            //TODO   _ = sqwidget._ || (window._ && window._.console || function () {};
            _ = sqwidget._ || window._ || function () {},
            config = {},
            messageCallback = function () {},
            searchTerm = '';
        
        _('twitter_stream called');
        /* init config from supplied*/
        jQuery.extend(true, config, newConfig);

        /**
         * Set the search expression for this feed
         */
         
        self.search = function(q, callback, limit) {
            var
                count = 0,
                limit = limit || 1,
                html = '',
                twitterlib = widget.plugins.twitterlib;
            
            searchTerm = (q ? encodeURIComponent(q) : searchTerm);
            twitterlib.search(searchTerm, { limit: limit }, function(tweets){
                $.each(tweets, function(i, tweet){
                    html += twitterlib.ify.clean(tweet.text);
                });
                callback(html);
            });
        };

        self.setMessageCallback = function (fn) {
            messageCallback = fn;
        };

        return self;
    
    }, '0.1.0', ['jquery, twitterlib']);

}());
