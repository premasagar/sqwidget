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
            //TODO   _ = sqwidget._ || (window._ && window._.console || function () {};
            _ = sqwidget._ || window._ || function () {},
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
            // TODO restart the search stream
        };
        
        /** handle a completed message coming in from the twitter api */
        self.message = function (results) {
            var
                i,r,
                text;
                
            if (results) {
                for (i=0; i<results.length; i+=1 ){
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
                    if (tweetsById[r.id]) {
                        continue; // ignore if already seen
                    }
                    tweetsById[r.id] = r;
                    tweets.push(r);
                    if (r.metadata.result_type == 'popular'){
                        popular.push(r);
                    }
                    else {
                        notPopular.push(r);
                    }
                }
                
                // extract any URLs
                // array of [extracted url, tweets]
                
                
                
                // push output to streams
                // TODO slicing
                widget.plugins.messaging.send('tweets', tweets);
                widget.plugins.messaging.send('popular', popular);
                widget.plugins.messaging.send('not_popular', notPopular);
                widget.plugins.messaging.send('resources', resources);
            }
            else {
                // ignore
            }
        };
        

        return self;
    
    }, '0.1.0', ['jquery']);

}());
