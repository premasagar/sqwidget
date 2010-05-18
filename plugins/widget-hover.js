var widget, placeholder, widgetVisible, mouseenterDelay, mouseleaveDelay;   
    
function mouseenter(){
    coords.mouse(true);
    setTimeout(function(){
        if (coords.elem(coords.mouse(), placeholder) && !widgetVisible){
            widget = showWidget();
            widgetVisible = true;
        }
    }, mouseenterDelay);
}

function mouseleave(){
    if (widgetVisible){
        setTimeout(function(){
            if (!coords.elem(coords.mouse(), placeholder) && !coords.elem(coords.mouse(), widget) && widgetVisible){
                hideWidget();
                widgetVisible = false;
            }
            coords.mouse(false);
        }, mouseleaveDelay);
    }
}

// **

$(placeholder)
    .mouseenter(mouseenter)
    .mouseleave(mouseleave);

$(widget)
    .mouseleave(mouseleave);
    
// TODO: click placeholder/click out of widget (incl. placeholder itself) trumps mouseenter/leave listeners
