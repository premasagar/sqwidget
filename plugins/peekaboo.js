'use strict';
/*
    Peekaboo
        Allows user to interact with a delegate element (e.g. a placeholder image or icon), to cause the widget to appear or disappear.
    
    exports
        var peekaboo
        
    usage
        peekaboo(delegateElem, showWidget, hideWidget, [mouseenterDelay], [mouseleaveDelay]);
        // delegateElem is the delegate element (e.g. a placeholder for the widget)
        // showWidget is a function that shows the widget - it also returns the widget element
        // hideWidget is a function that hides the widget
        // [opt] mouseenterDelay is the timeout delay in ms when the mouse enters the delegate element (default: 250ms)
        // [opt] mouseleaveDelay is the timeout delay in ms when the mouse leaves the delegate element (default: same as mouseenterDelay)
*/


(function($){

/////////////////////////////////////////

var mouseInWidget = false; // this is an outside variable so that we can expose methods to manipulate it


function peekaboo(delegateElem, showWidget, hideWidget, mouseenterDelay, mouseleaveDelay){
    var document = window.document,
        widget, widgetStickyOn, widgetVisible, mouseInDelegate, waitTillMouseLeavesDelegate;
        
    function show(){
        _('show');
        widgetVisible = true;
        return showWidget();
    }
    
    function hide(){
        _('hide');
        widgetVisible = false;
        return hideWidget();
    }
    
    function hideDelay(){
        _('hideDelay');
        window.setTimeout(function(){
            _('hideDelay setTimeout', widgetVisible, widgetStickyOn, mouseInDelegate, mouseInWidget, waitTillMouseLeavesDelegate);
            if (widgetVisible && !widgetStickyOn && !mouseInDelegate && !mouseInWidget){
                hide();
            }
        }, mouseleaveDelay);
    }
    
    function mouseenterWidget(){
        _('mouseenterWidget');
        mouseInWidget = true;
    }
    
    function mouseleaveWidget(){
        _('mouseleaveWidget');
        mouseInWidget = false;
        hideDelay();
    }
        
    function showDelay(){
        _('showDelay');
        window.setTimeout(function(){
            _('showDelay setTimeout', widgetVisible, widgetStickyOn, mouseInDelegate, mouseInWidget, waitTillMouseLeavesDelegate);
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
        _('clickDocument', widgetVisible, widgetStickyOn, mouseInDelegate, mouseInWidget, waitTillMouseLeavesDelegate);
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
            _('clickDelegateElem', widgetVisible, widgetStickyOn, mouseInDelegate, mouseInWidget, waitTillMouseLeavesDelegate);
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
            return false;
        });
}

// This is here to expose control over whether the mouse is considered to be truly within the widget. This is useful, for example, in IE6 where it erroneously fires the 'mouseleave' event on the widget, when a select box within the widget is opened.

/*
    if (ie6){
        $(optionElement).mouseenter(function(){
            delegate.mouseInWidget(true);
        });
    }
*/
peekaboo.mouseInWidget = function(isInWidget){
    _('peekaboo.mouseInWidget', isInWidget);
    if (typeof isInWidget === 'boolean'){
        mouseInWidget = isInWidget;
    }
    return mouseInWidget;
};


/////////////////////////////////////////


Sqwidget.plugin('peekaboo', function(){
    return peekaboo;
}, '0.1.0', ['jquery']);

}(jQuery));
