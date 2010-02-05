(function(){
    /*
    Returns the 'dataset' property of an element, or a read-only object that mimics it.

    The 'dataset' property is new in HTML5. It is a hash of key-value pairs, based on the element's attributes that are prefixed with 'data-'.

    See:
    http://ejohn.org/blog/html-5-data-attributes/
    http://dev.w3.org/html5/spec/Overview.html#custom

    */

    function dataset(elem){
        return elem.dataset ||
            (function(){
                for (
                    var
                        dataset = {},
                        attrs = elem.attributes,
                        i = attrs.length,
                        attr;
                     i;
                     i--
                ){
                    attr = attrs[i-1];
                    if (attr.name.slice(0,5) === 'data-'){
                        dataset[attr.name.slice(5)] = attr.value;
                    }
                }
                return dataset;
            }());
    }
    
    var
        window = this,
        document = window.document,
        DOMContentLoaded,
        isReady,
        readyBound,
        readyList = [],
        
        scripts = document.getElementsByTagName('script'),
        elem = scripts.length ?
            scripts[scripts.length - 1] :
            null,
        data = elem ? dataset(elem) : null;
        
        // **
        
        
        var demo = '', prop;
        for (prop in data){
            if (data.hasOwnProperty(prop)){
                demo += '<br />' + prop + ': ' + data[prop];
            }
        }
        document.getElementById('report').innerHTML = demo;
}());
