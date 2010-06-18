/**
 * Twitter stream - streaming twitter
 * @author Graeme Sutherland
 */
 
/*jslint nomen: false*/
/*global Sqwidget,window */    

(function () {
    
    // load socket.io or whatever
    //

    
    
    Sqwidget.plugin('twitter_processor', function (sqwidget, widget, jQuery, newConfig) {
        var 
            self = {},
            _ = sqwidget._,
            config = {},
            tweetsById = {},
            tweets=[],
            popular=[],
            notPopular=[],
            resources=[];
        /* init config from supplied*/
        jQuery.extend(true, config, newConfig);

        /*
         * init structures
         */


        /**
         * Set the search expression for this feed
         */
         
        self.reset = function () {
           
            tweetsById = {};
            tweets=[];
            popular=[];
            notPopular=[];
            resources=[];
        };
        
        /** handle a completed message coming in from the twitter api */
        self.message = function (results) {
            var
                i,r,
                text;
            _('got twitter message', results);
            if (results) {
                tweets=[];
                popular=[];
                notPopular=[];
                resources=[];
                for (i=0; i<results.length; i += 1 ){
                    r = results[i];
                    //
                    // process results, it looks like
                    //  profile_image_url
                    //  created_at
                    //  from_user
                    //  metadata {
                    //       result_type
                    // }
                    // to_user_id
                    // text
                    // id
                    // from_user_id
                    // geo
                    // iso_langauge_code
                    // source
                    /*
                        a = {"profile_image_url":"http://a3.twimg.com/profile_images/411056631/Avatar_normal.png","created_at":"Sat, 08 May 2010 16:35:47 +0000","from_user":"springbak","metadata":{"result_type":"recent"},"to_user_id":null,"text":"Ron Artest has Lakers all a-Twitter, as he critized Phil Jackson. | LA Times #lakers #NBA http://ht.ly/1IADG","id":13617437107,"from_user_id":9938616,"geo":null,"iso_language_code":"en","source":"&lt;a href=&quot;http://www.hootsuite.com&quot; rel=&quot;nofollow&quot;&gt;HootSuite&lt;/a&gt;"};
                    */
                    if (!(tweetsById[r.id])) {
                        tweetsById[r.id] = r;
                        tweets.unshift(r);
                        if (r.metadata.result_type === 'popular'){
                            popular.unshift(r);
                        }
                        else {
                            notPopular.unshift(r);
                        }
                    }
                }
                
                // extract any URLs
                // array of [extracted url, tweets]
                
                _(tweets);
                // TODO slicing
                widget.plugins.messaging.send('tweets', {tweets:tweets});
                widget.plugins.messaging.send('popular', {tweets:popular});
                widget.plugins.messaging.send('not_popular', {tweets:notPopular});
                widget.plugins.messaging.send('resources', {tweets:resources});
            }
            else {
                // ignore
            }
        };
        

        return self;
    
    }, '0.1.0', ['jquery']);

}());
