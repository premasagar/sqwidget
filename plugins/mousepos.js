// track the mouse's position
var mousepos = (function($){
    var x = null
    ,   y = null
    ,   tracking = false;
    
    function captureCoords(ev){
        x = ev.pageX;
        y = ev.pageY;
    }
    
    function startTracking(){
        $(document).mouseMove(captureCoords);
    }
    
    function stopTracking(){
        $(document).unbind('mouseMove', captureCoords);
    }
    
    return function(doTracking){
        if (doTracking === true && !tracking){
            startTracking();
            tracking = true;
        }
        else if (doTracking === false && tracking){
            stopTracking();
            tracking = false;
        }
        return
            {   x:x
            ,   y:y
            ,   tracking:tracking
            }
        ;
    };
}(jQuery));


// check if coordinates are within a target element
var overTarget = (function($){
    function boundingBox(element, includeMargin){
        var $elem = $(element)
        ,   w = $elem.outerWidth(includeMargin
        ,   h = $elem.outerHeight(includeMargin)
        ,   offset = $elem.offset()
        ,   x = offset.left + w
        ,   y = offset.top + h
        ;
        
        return
                // distance of top of element from top of document
            {   top: offset.top
                // distance of right of element from left of document
            ,   right: offset.left + w
                // distance of bottom of element from top of document
            ,   bottom: offset.top + h
                // distance of left of element from left of document
            ,   left: offset.left
            };
    }
    
    function within(coords, bounds){
        return
            (
                coords.x >= bounds.left
            &&  coords.x <= bounds.right
            &&  coords.y >= bounds.top
            &&  coords.y <= bounds.bottom
            );
    }

    return function(coords, target, includeMargin){
        includeMargin = !!includeMargin;
        return within(coords, boundingBox(target, includeMargin);
    };
}(jQuery));


// callback a function, if mouse coordinates are within a target, or another function, if not
function ifOverTarget
    (   target
    ,   eventName
    ,   callbackOverTarget
    ,   callbackNotOverTarget
    )
    {
        callbackOverTarget = callbackOverTarget || function(){};
        callbackNotOverTarget = callbackNotOverTarget || function(){};
        mousepos(true);
        $(elem).bind(eventName, function(){
            if (overTarget(mousepos(), target){
                callbackOverTarget.call(elem);
            }
            else {
                callbackNotOverTarget.call(elem);
            }
            mousepos(false);
        });
        return ifOverTarget;
    }

ifOverTarget
    (placeholder, 'delayedPlaceholderMouseover', showWidget)
    (widget, 'delayedPlaceholderMouseleave', hideWidget)
;
