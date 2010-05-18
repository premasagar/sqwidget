function widgetDelegate(placeholder, showWidget, hideWidget){
    // NOTE: showWidget() should return a reference to the widget, unless widget    
    var widget, widgetVisible, mouseenterDelay, mouseleaveDelay;

    function show(){
        widgetVisible = true;
        widget = showWidget();
        return false;
    }

    function hide(){
        widgetVisible = false;
        hideWidget();
        return false;
    }

    function mouseleave(){
        if (widgetVisible){
            window.setTimeout(function(){
                $.coords.mouse(false); // TODO: $.coords.mouse() what if another script still needs mouse tracking?
                if (widgetVisible && !$.coords.mouse(placeholder) && !$.coords.mouse(widget)){
                    hide();
                    widget.unbind('mouseleave', mouseleave);
                }
            }, mouseleaveDelay);
        }
    }
        
    function mouseenter(){
        $.coords.mouse(true);
        window.setTimeout(function(){
            if (!widgetVisible && $.coords.mouse(placeholder)){
                show();
                widget.bind('mouseleave', mouseleave);
            }
        }, mouseenterDelay);
    }

    function clickPlaceholder(){
        $.coords.mouse(false);
        placeholder.unbind('mouseleave', mouseleave);
        show();
        
        $(window.document).one('click', function(ev){
            if (!$.coords.elem([ev.pageX, ev.pageY], widget)){ // TODO: or see if ev.target === widget or a child of widget
                placeholder.bind('mouseleave', mouseleave);
                hide();
            }
        });
    }

    // **

    $(placeholder)
        .mouseenter(mouseenter)
        .mouseleave(mouseleave)
        .click(clickPlaceholder);
}

widgetDelegate(placeholder, showWidget, hideWidget);
