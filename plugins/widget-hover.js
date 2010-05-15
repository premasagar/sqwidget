var widget, placeholder, mouseenterDelay, mouseleaveDelay, overPlaceholder, overWidget;   
    
function mouseenter(){
    setTimeout(function(){
        if (overPlaceholder && !widget.is(':visible')){
            showWidget();
            overWidget = true;
        }
    }, mouseenterDelay);
}

function mouseleave(){
    setTimeout(function(){
        if (!overPlaceholder && !overWidget && widget.is(':visible')){
            hideWidget();
        }
    }, mouseleaveDelay);
}

// **

$(placeholder)
    .mouseenter(function(){
        overPlaceholder = true;
        mouseenter();
    })
    .mouseleave(function(){
        overPlaceholder = false;
        mouseleave();
    });

$(widget)
    .mouseenter(function(){
        overWidget = true;
        // don't do anything
    })
    .mouseleave(function(){
        overWidget = false;
        mouseleave();
    });
