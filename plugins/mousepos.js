// track the mouse's position
var mousepos = (function($){
    var document = window.document,
        x = null,
        y = null,
        tracking = false;
    
    function captureCoords(ev){
        x = ev.pageX;
        y = ev.pageY;
    }
    
    function startTracking(){
        $(document).mousemove(captureCoords);
    }
    
    function stopTracking(){
        $(document).unbind('mousemove', captureCoords);
    }
    
    return $.extend(
        function(doTracking){
            if (doTracking === true && !tracking){
                startTracking();
                tracking = true;
            }
            else if (doTracking === false && tracking){
                stopTracking();
                tracking = false;
            }
            return {
                x:x,
                y:y,
                tracking:tracking
            };
        },
        {
            toArray: function(){
                var pos = this();
                return [pos.x, pos.y];
            }
        }
    );
}(jQuery));


// check if coordinates are within a target element
var overTarget = (function($){
    function boundingBox(element, includeMargin){
        var $elem = $(element),
            offset = $elem.offset(),
            w = $elem.outerWidth(includeMargin),
            h = $elem.outerHeight(includeMargin);
        
        
        return {
                // distance of top of element from top of document
                top: offset.top,
                // distance of right of element from left of document
                right: offset.left + w,
                // distance of bottom of element from top of document
                bottom: offset.top + h,
                // distance of left of element from left of document
                left: offset.left
            };
    }
    
    function within(coords, bounds){
        if ($.isArray(coords)){
            coords = {x:coords[0], y:coords[1]};
        }
        return (
            coords.x >= bounds.left &&
            coords.x <= bounds.right &&
            coords.y >= bounds.top &&
            coords.y <= bounds.bottom
        );
    }

    return function(coords, target, includeMargin){
        includeMargin = !!includeMargin;
        return within(coords, boundingBox(target, includeMargin));
    };
}(jQuery));


// callback a function, if mouse coordinates are within a target, or another function, if not
function ifOverTarget(
    target,
    eventName,
    callbackOverTarget,
    callbackNotOverTarget
){
    callbackOverTarget = callbackOverTarget || function(){};
    callbackNotOverTarget = callbackNotOverTarget || function(){};
    mousepos(true);
    $(elem).bind(eventName, function(){
        if (overTarget(mousepos(), target)){
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
