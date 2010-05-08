/**
 * Twitter stream - streaming twitter
 * @author Graeme Sutherland
 */
 
/*jslint nomen: false*/
/*global Sqwidget,window */    

(function () {
    
    // load socket.io or whatever
    //

    
    
    Sqwidget.plugin('twitter_stream', function (sqwidget, widget, jQuery, newConfig) {
        var 
            self = {},
            //TODO   _ = sqwidget._ || (window._ && window._.console || function () {};
            _ = sqwidget._ || window._ || function () {},
            config = {},
            messageCallback = function () {},
            searchExpression = '';
        
        _('twitter_stream called');
        /* init config from supplied*/
        jQuery.extend(true, config, newConfig);

        /**
         * Set the search expression for this feed
         */
         
        self.restartSearch = function () {
            // TODO restart the search stream
        };
        
        self.setSearchExpression = function (expr) {
            searchExpression = expr;
            self.restartSearch();
        };

        self.setMessageCallback = function (fn) {
            messageCallback = fn;
        };
        

        return self;
    
    }, '0.1.0', ['jquery']);

}());