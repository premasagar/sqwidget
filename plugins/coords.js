var coords = (function($){

    // track the mouse's position
    var mouse = (function(){
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
                    mouse.tracking = tracking = true;
                }
                else if (doTracking === false && tracking){
                    stopTracking();
                    mouse.tracking = tracking = false;
                }
                return {
                    x:x,
                    y:y
                };
            },
            {
                toArray: function(){
                    var pos = this();
                    return [pos.x, pos.y];
                },
                tracking: tracking
            }
        );
    }());


    // check if coordinates are within a target element
    var elem = (function(){        
        function toBounds(arg, includeMargin){
            var top, right, bottom, left, elem, offset, w, h;
            
            // point object: {x:n, y:n}
            if ($.isPlainObject(arg) && 'x' in arg && 'y' in arg){
                left = right = arg.x;
                top = bottom = arg.y;
            }
            // point array: [n, n]
            else if ($.isArray(arg) && arg.length === 2){
                left = right = arg[0];
                top = bottom = arg[1];
            }
            // bounds object: {top:n, right:n, bottom:n, left:n}
            // NOTE: isPlainObject() requires jQuery 1.4x
            else if ($.isPlainObject(arg) && 'top' in arg && 'right' in arg && 'bottom' in arg && 'left' in arg){
                top = arg.top;
                right = arg.right;
                bottom = arg.bottom;
                left = arg.left;
            }
            // bounds array: [n, n, n, n]
            else if ($.isArray(arg) && arg.length === 4){
                top = arg[0];
                right = arg[1];
                bottom = arg[2];
                left = arg[3];
            }
            // element or selector
            else {
                elem = $(arg);
                offset = elem.offset();
                w = elem.outerWidth(includeMargin);
                h = elem.outerHeight(includeMargin);
                
                top = offset.top;
                // distance of right of element from left of document
                right = offset.left + w;
                // distance of bottom of element from top of document
                bottom = offset.top + h;
                // distance of left of element from left of document
                left = offset.left;
            }
            return {
                top: top,
                right: right,
                bottom: bottom,
                left: left
            };
        }        
              
        function overlaps(bounds1, bounds2){
            return (
                (
                    bounds1.left >= bounds2.left &&
                    bounds1.left <= bounds2.right &&
                    bounds1.top >= bounds2.top &&
                    bounds1.top <= bounds2.bottom
                ) || (
                    bounds1.right >= bounds2.left &&
                    bounds1.right <= bounds2.right &&
                    bounds1.bottom >= bounds2.top &&
                    bounds1.bottom <= bounds2.bottom
                )
            );
        }
        
        return function(bounds1, bounds2){ // optional last arg: includeMargin
            var includeMargin = $.makeArray(arguments).slice(-1)[0];            
            includeMargin = includeMargin === true ? true : false;
            
            // if no bounds or elements are passed, then the default is the top-level <html> element
            if (!bounds1 || bounds1 === true){
                bounds1 = 'html';
            }
            bounds1 = toBounds(bounds1, includeMargin);
            
            // looking for bounds of element in arg1?
            if (typeof bounds2 === 'undefined' || typeof bounds2 === 'boolean'){
                return bounds1;
            }
            bounds2 = toBounds(bounds2, includeMargin);
            
            return overlaps(bounds1, bounds2);
        };
    }());
    
    return {
        mouse: mouse,
        elem: elem
    };
}(jQuery));
