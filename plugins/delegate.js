'use strict';
/*
    Delegate
        Allows user to interact with a delegate element (e.g. a placeholder image or icon), to cause the widget to appear or disappear.
    
    exports
        var delegate
        
    usage
        delegate(delegateElem, showWidget, hideWidget, [mouseenterDelay], [mouseleaveDelay]);
        // delegateElem is the delegate element (e.g. a placeholder for the widget)
        // showWidget is a function that shows the widget - it also returns the widget element
        // hideWidget is a function that hides the widget
        // [opt] mouseenterDelay is the timeout delay in ms when the mouse enters the delegate element (default: 250ms)
        // [opt] mouseleaveDelay is the timeout delay in ms when the mouse leaves the delegate element (default: same as mouseenterDelay)
*/


(function(sqwidget, widget, $){

/////////////////////////////////////////


function delegate(delegateElem, showWidget, hideWidget, mouseenterDelay, mouseleaveDelay){
    var document = window.document,
        widget, widgetStickyOn, widgetVisible, mouseInWidget, mouseInDelegate, waitTillMouseLeavesDelegate;
        
    function show(){
        widgetVisible = true;
        return showWidget();
    }
    
    function hide(){
        widgetVisible = false;
        return hideWidget();
    }
    
    function hideDelay(){
        window.setTimeout(function(){
            if (widgetVisible && !widgetStickyOn && !mouseInDelegate && !mouseInWidget){
                hide();
            }
        }, mouseleaveDelay);
    }
    
    function mouseenterWidget(){
        mouseInWidget = true;
    }
    
    function mouseleaveWidget(){
        mouseInWidget = false;
        hideDelay();
    }
        
    function showDelay(){
        window.setTimeout(function(){
            if (!widgetVisible && mouseInDelegate && !waitTillMouseLeavesDelegate){
                widget = show();
                $(widget)
                    .unbind('mouseenter', mouseenterWidget) // unbind handlers, since we don't know if this is the first time we're seeing the widget DOM node, or if we have already bound events to it
                    .unbind('mouseleave', mouseleaveWidget)
                    .one('mouseenter', mouseenterWidget)
                    .one('mouseleave', mouseleaveWidget);
            }
        }, mouseenterDelay);
    }
    
    function clickDocument(){
        if (widgetVisible && widgetStickyOn && !mouseInDelegate && !mouseInWidget){
            widgetStickyOn = false;
            hide();
        }
    }
    
    $(delegateElem)
        .hover(
            function(){
                mouseInDelegate = true;
                showDelay();
            },
            function(){
                mouseInDelegate = false;
                hideDelay();
            }
        )
        .click(function(){
            widgetStickyOn = !widgetStickyOn;
            if (widgetStickyOn){
                $(document).click(clickDocument);
                show();
            }
            else {
                waitTillMouseLeavesDelegate = true;
                $(delegateElem)
                    .one('mouseleave', function(){
                        waitTillMouseLeavesDelegate = false;
                    });
                $(document).unbind('click', clickDocument);
                hide();
            }
        });
}

/////////////////////////////////////////


Sqwidget.plugin('delegate', function(){
    return delegate;
}, '0.1.0', ['jquery']);

}());
