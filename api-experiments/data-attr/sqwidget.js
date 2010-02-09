(function(){

    /*!
    * Dataset
    *   github.com/premasagar/mishmash/tree/master/dataset/
    *
    */         
    function dataset(elem){
        return elem.dataset ||
            (function(){
                for (
                    var
                        dataset = {},
                        attrs = elem.attributes,
                        i = attrs.length,
                        attr, attrName;
                     i;
                     i--
                ){
                    attr = attrs[i-1];
                    attrName = attr.name;
                    if (attrName.slice(0,5) === 'data-'){
                        dataset[attrName.slice(5)] = attr.value;
                    }
                }
                return dataset;
                // NOTE: this is a read-only hash. If you need to set a data property, where the browser does not support the 'dataset' object, then use: elem.setAttribute('data-' + name, value);
            }());
    }
    
    // **
    
    // Find the <script> element that called this script, then grab its dataset object.
    var
        scripts = document.getElementsByTagName('script'),
        widget = scripts[scripts.length-1],
        data = dataset(widget);
        
        // **
        
    // Write out the results
    var demo = '', prop;
    for (prop in data){
        if (data.hasOwnProperty(prop)){
            demo += '<br />' + prop + ': ' + data[prop];
        }
    }
    document.getElementById('datafound').innerHTML = demo;
    
    // **
    
    // Find data attributes for divs with data- attributes
    // Needs to be run on document ready - after the DOM has loaded, or at least after all widgets have been included in the DOM, e.g. just before the closing body tag
    
    var
        divs = document.getElementsByTagName('div'),
        len = divs.length,
        widgets = [],
        div, i, j, attrs, attrlen, widgetslen, widget;
        
    for (i = len; i; i--){
        div = divs[i-1];
        attrs = div.attributes;
        attrslen = attrs.length;
        for (j = attrslen; j; j--){
            if (attrs[j-1].name === 'data-sqwidget'){
                widgets.push(div);
                break;
            }
        }
    }
    
    widgetslen = widgets.length;
    for (i = widgetslen; i; i--){
        widget = widgets[i-1];
        data = dataset(widget);
        
        demo = '';
        for (prop in data){
            if (data.hasOwnProperty(prop)){
                demo += '<br />' + prop + ': ' + data[prop];
            }
        }
        document.getElementById('datafound').innerHTML += '<hr />' + demo;
    }
    
}());

/*jslint browser: true, devel: true, onevar: true, undef: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
