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
            config = {
                limit: 3
            },
            searchTerm = '';
            twitterlib = widget.plugins.twitterlib;
        
        _('twitter_stream called');
        /* init config from supplied*/
        jQuery.extend(true, config, newConfig);

        /**
         * Search the Twitter API
         */
        self.search = function(q, callback, l) {
            var
                count = 0,
                limit = l || config.limit;
            
            searchTerm = (q ? encodeURIComponent(q) : searchTerm);
            twitterlib.search(searchTerm, { limit: limit }, callback);
        };

        return self;
    
    }, '0.1.0', ['jquery, twitterlib']);

}());
